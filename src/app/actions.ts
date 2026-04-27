"use server"
import { createClient } from '@/utils/supabase/server';
import { success, z } from 'zod';
import { redirect } from "next/navigation"
import { revalidatePath } from 'next/cache';
import { cookies } from "next/headers";
import { createClient as createServerClient } from '@supabase/supabase-js';

interface Children {
    childrenName: string,
    childrenOccupation: string,
    childrenYearLevel: string
}

const applicationSchema = z.object({
    name: z.string().min(2, "Full name is required"),
    age: z.coerce.number().min(1, "Valid age is required"),
    sex: z.enum(["Male", "Female"]),
    religion: z.string().optional(),
    citizenship: z.string().min(1, "Citizenship is required"),
    bday: z.string().min(1, "Birthday is required"),
    maritalStatus: z.string().min(1, "Marital status is required"),
    contact: z.string().min(11, "Contact number must be at least 11 digits"),
    email: z.string().email("Invalid email format").optional(),
    address: z.string().min(5, "Full address is required"),

    // --- Educational Info ---
    schoolType: z.string(),
    schoolName: z.string(),
    schoolAddress: z.string(),
    studentLevel: z.string(),
    gradeLevel: z.string().optional(),
    yearLevel: z.string().optional(),
    course: z.string().optional(),
    gwa: z.coerce.number().optional(),
    average: z.coerce.number().optional(),

    // --- Family & Income ---
    isMotherAlive: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
    isFatherAlive: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),

    totalIncome: z.coerce.number().min(0, "Income cannot be negative").optional(),
    numberOfChild: z.coerce.number().min(0, "Number of children cannot be negative").optional(),

    // Mother Info
    motherName: z.string().optional(),
    motherAge: z.coerce.number().optional(),
    motherAddress: z.string().optional(),
    motherContact: z.string().optional(),
    motherOccupation: z.string().optional(),
    motherEducAttainment: z.string().optional(),

    // Father Info
    fatherName: z.string().optional(),
    fatherAge: z.coerce.number().optional(),
    fatherAddress: z.string().optional(),
    fatherContact: z.string().optional(),
    fatherOccupation: z.string().optional(),

    // --- Dependents Array (JSONB) ---
    dependents: z.array(
        z.object({
            childrenName: z.string().min(1, "Dependent name is required"),
            childrenOccupation: z.string().optional(),
            childrenYearLevel: z.string().optional()
        })
    ).default([]),
    document_urls: z.array(z.string().url("Must be valid URL")).default([]),
    batch_id: z.coerce.number()
})

export async function checkNameExists(name: string) {

    if (!name || name.length < 2) return false;

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("applications")
        .select("name, status")
        .ilike("name", name)
        .maybeSingle();

    if (error) {
        console.log("checking error", error)
        return false;
    }

    if (!!data) {
        if (data.status === "PENDING" || data.status === "APPROVED") {
            return true;
        }
        return false;
    }

    return false;

}

export async function submitApplication(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());

    const numberOfChild = Number(rawData.numberOfChild);

    const childrenNameArray = formData.getAll("childrenName");
    const childrenOccupationArray = formData.getAll("childrenOccupation");
    const childrenYearLevelArray = formData.getAll("childrenYearLevel");
    const childrenArray: Children[] = [];

    for (let i = 0; i < numberOfChild; i++) {
        const child: Children = {
            childrenName: String(childrenNameArray[i] ?? ''),
            childrenOccupation: String(childrenOccupationArray[i] ?? ''),
            childrenYearLevel: String(childrenYearLevelArray[i] ?? '')
        };
        childrenArray.push(child);
    }

    const { coe, cog, validID, ...databaseData } = rawData;
    const supabase = await createClient();

    const validatedFields = applicationSchema.safeParse(databaseData);
    if (!validatedFields.success) {
        console.error("Validation Failed:", validatedFields.error.flatten().fieldErrors);
        return { success: false, message: "Please check your inputs and try again." };
    }
    const cleanData = validatedFields.data;

    const coeFile = coe as File;
    const cogFile = cog as File;
    const validIDFile = validID as File;
    const filesToUpload = [coeFile, cogFile, validIDFile];
    const trackingID = `GA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    try {
        const uploadMissions = filesToUpload.map(async (file) => {

            if (!file || file.size === 0 || !file.name) return null;

            const fileExt = file.name.split('.').pop();
            const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${cleanData?.name}/${uniqueFileName}`;

            const { data, error } = await supabase
                .storage
                .from('educ-assistance-application-documents')
                .upload(filePath, file)

            if (error) {
                console.error(`--- SUPABASE UPLOAD ERROR for ${file.name} ---`);
                console.error(error);
                throw new Error(`Failed to upload ${file.name}: ${error.message}`);
            }

            // Get the URL
            const { data: publicUrlData } = supabase
                .storage
                .from('educ-assistance-application-documents')
                .getPublicUrl(filePath);

            // Return JUST the URL string for this specific file
            return publicUrlData.publicUrl;


        });

        const uploadedUrls = await Promise.all(uploadMissions)

        const validUrls = uploadedUrls.filter((url) => url !== null);

        console.log("All files uploaded in record time!", validUrls);

        const { error: dbError } = await supabase
            .from("applications")
            .insert({
                name: cleanData?.name,
                age: cleanData?.age,
                sex: cleanData?.sex,
                religion: cleanData?.religion,
                citizenship: cleanData?.citizenship,
                bday: cleanData?.bday,
                marital_status: cleanData?.maritalStatus,
                contact: cleanData?.contact,
                email: cleanData?.email,
                address: cleanData?.address,

                school_type: cleanData?.schoolType,
                school_name: cleanData?.schoolName,
                school_address: cleanData?.schoolAddress,
                student_level: cleanData?.studentLevel,
                grade_level: cleanData?.gradeLevel,
                year_level: cleanData?.yearLevel,
                course: cleanData?.course,
                gwa: cleanData?.gwa,
                average: cleanData?.average,

                is_mother_alive: cleanData?.isMotherAlive,
                is_father_alive: cleanData?.isFatherAlive,
                total_income: cleanData?.totalIncome,
                number_of_child: cleanData?.numberOfChild,

                mother_name: cleanData?.motherName,
                mother_age: cleanData?.motherAge,
                mother_address: cleanData?.address,
                mother_contact: cleanData?.motherContact,
                mother_occupation: cleanData?.motherOccupation,
                mother_educ_attainment: cleanData?.motherEducAttainment,

                father_name: cleanData?.fatherName,
                father_age: cleanData?.fatherAge,
                father_address: cleanData?.fatherAddress,
                father_contact: cleanData?.fatherContact,
                father_occupation: cleanData?.fatherOccupation,

                dependents: childrenArray,
                document_urls: validUrls,
                tracking_id: trackingID,
                batch_id: cleanData?.batch_id
            })

    } catch (error) {
        console.error("Parallel upload Error:", error)
        return { success: false, message: "One or more files failed to upload" }
    }
    redirect(`/apply/success?id=${trackingID}`);
}

interface Response {
    success: boolean,
    message: string
}

export async function authenticateUser(formData: FormData): Promise<Response> {
    if (!formData) {
        return { success: false, message: "Invalid input." };
    }
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = await createClient();

    const { error: Autherror } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (Autherror) {
        return { success: false, message: "Invalid email or password" }
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "Authentication failed!" }
    }

    return { success: true, message: "Login successful" }
}


export async function getSecuredFileURL(filePath: string) {
    if (!filePath) {
        throw new Error("No file path provided")
    }
    const supabase = await createClient();

    const cleanPath = filePath.split('educ-assistance-application-documents/')[1];

    // Safety check in case the string split fails
    if (!cleanPath) {
        throw new Error("Invalid file path format");
    }

    const { data, error } = await supabase.storage
        .from("educ-assistance-application-documents")
        .createSignedUrl(cleanPath, 60);

    if (error || !data) {
        throw new Error("Failed to generate secure link.")
    }

    return data.signedUrl;

}

export async function updateRecordStatus(id: string, newStatus: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("applications")
        .update({ status: newStatus })
        .eq("id", id)

    if (error) {
        throw new Error("Failed to update status!")
    }

    revalidatePath("/records");

}

export async function signoutUser() {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut();

    if (error) {
        throw new Error("Failed to signout user: ", error)
    }

    redirect("/login");
}

export async function getTrackingDetails(id: string) {
    const supabase = await createClient();

    const { data: application, error } = await supabase
        .from("applications")
        .select("status, created_at")
        .eq("tracking_id", id)
        .single();

    if (error) {
        throw new Error("Failed to track", error)
    } else if (!application) return { message: "Application not found" }

    return { application };
}

export async function verifyCode(code: string) {
    const normalizedCode = code.trim();

    if (!normalizedCode) {
        return { success: false, message: "Incorrect code", id: null };
    }

    const supabase = await createClient();

    const { data: batch, error } = await supabase
        .from("batches")
        .select("id, max_approved, deadline, is_active")
        .eq("is_active", true)
        .ilike("verification_code", normalizedCode)
        .single();

    if (error) console.log(error);

    if (!batch) return { success: false, message: "Incorrect code", id: null };

    if (new Date() > new Date(batch.deadline)) return { success: false, message: "The application deadline has passed.", id: null }

    const { count: currentApps } = await supabase
        .from("applications")
        .select("*", { count: "exact", head: true })
        .eq("batch_id", batch.id)
        .eq("status", "APPROVED");

    if (currentApps !== null && currentApps >= batch.max_approved) return { success: false, message: "Sorry, this program has achieved the targeted number of beneficiaries.", id: null }

    return { success: true, message: "Success", id: batch.id }

}

const batchSchema = z.object({
    batchId: z.string().nullable().optional(),
    name: z.string().min(2, "Name too short"),
    max_ben: z.preprocess(
        (value) => value === "" ? undefined : value,
        z.coerce.number().optional()
    ),
    code: z.string(),
    deadline: z.preprocess(
        (value) => value === "" ? undefined : value,
        z.string().optional()
    ),
    assignedAdmins: z.array(z.string())

})

export async function createBatch(adminsToDelete: string[], formData: FormData) {
    if (!formData) {
        redirect("/dashboard")
    }

    const supabase = await createClient();

    const rawData = {
        batchId: formData.get("batchId"),
        name: formData.get("name"),
        max_ben: formData.get("max_ben"),
        code: formData.get("code"),
        deadline: formData.get("deadline"),
        assignedAdmins: formData.getAll("assignedAdmins"),
    };

    const isEditing = !!rawData.batchId;
    const validatedFields = batchSchema.safeParse(rawData);

    if (!validatedFields.success) {
        console.error("Zod Validation Failed:", validatedFields.error.flatten());
        return;
    }
    const cleanData = validatedFields.data;
    if (!cleanData) {
        return;
    }

    if (adminsToDelete && adminsToDelete.length > 0) {
        await supabase
            .from("batch_admins")
            .delete()
            .in("admin_id", adminsToDelete)
            .eq("batch_id", cleanData?.batchId)
    }

    if (isEditing) {
        await supabase
            .from("batches")
            .update({
                name: cleanData?.name,
                max_approved: cleanData?.max_ben,
                verification_code: cleanData?.code,
                deadline: cleanData?.deadline
            })
            .eq("id", cleanData?.batchId);

        if (cleanData?.assignedAdmins.length !== 0) {

            const adminRowsToInsert = cleanData.assignedAdmins.map((adminId) => ({
                batch_id: cleanData.batchId,
                admin_id: adminId
            }));

            const { error } = await supabase
                .from("batch_admins")
                .upsert(
                    adminRowsToInsert,
                    {
                        onConflict: 'batch_id, admin_id',
                        ignoreDuplicates: true
                    }
                );
            if (error) {
                throw new Error("Failed to assign admin");
            }
        }
    } else {
        const { data: newBatch, error: batchError } = await supabase
            .from("batches")
            .insert({
                name: cleanData?.name,
                max_approved: cleanData?.max_ben,
                verification_code: cleanData?.code,
                deadline: cleanData?.deadline
            })
            .select("id")
            .single();

        if (!newBatch || batchError) {
            throw new Error(`Batch insert error: ${batchError.message}`)
        }

        if (cleanData?.assignedAdmins) {

            const adminRowsToInsert = cleanData.assignedAdmins.map((adminId) => ({
                batch_id: newBatch.id,
                admin_id: adminId
            }));

            const { error: assignError } = await supabase
                .from("batch_admins")
                .insert(adminRowsToInsert)
            if (assignError) {
                throw new Error(`Assigning error: ${assignError?.message}`)
            }
        }
    }

    revalidatePath("/dashboard/configure")
    redirect("/dashboard");

}

export async function deleteSession(sessionId: string) {
    if (!sessionId) {
        redirect("/dashboard")
    }

    const supabase = await createClient();
    await supabase
        .from("batches")
        .delete()
        .eq("id", sessionId)

    redirect("/dashboard");

}

export async function changeBatchStatus(sessionStatus: boolean, sessionId: string) {

    if (sessionStatus === null || !sessionId) {
        return
    }

    const supabase = await createClient()

    const { error: updateError } = await supabase
        .from("batches")
        .update({ is_active: !sessionStatus })
        .eq("id", sessionId);

    if (updateError) throw new Error(updateError.message);

    revalidatePath("/dashboard");

}

export async function setActiveBatch(batchId: string) {
    const cookieStore = await cookies();

    cookieStore.set("active_batch_id", batchId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    revalidatePath("/", "layout");
}

const adminSchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string()
})

export type FormState = {
    success: boolean,
    message: string,
    errors?: any;
}

const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function createNewAdmin(prevState: FormState, formData: FormData): Promise<FormState> {
    if (!formData) return { success: false, message: "All fields must be filled", errors: null };

    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password")
    }

    const validatedFields = adminSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing or invalid fields. Please check your inputs.",
        };
    }

    const cleanData = validatedFields.data;

    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email: cleanData.email,
        password: cleanData.password,
        email_confirm: true,
    });

    if (userError) {
        return { success: false, message: `Failed to create user`, errors: userError.message }
    } else {

        const newUser = {
            id: user?.id,
            name: cleanData.name,
            role: "ADMIN",
            email: user?.email
        }
        const { error: profileError } = await supabase
            .from("profiles")
            .insert(newUser);

        if (profileError) {
            return { success: false, message: `Failed to create profile`, errors: profileError.message }
        }

    }

    return { success: true, message: `Successfully created account for ${cleanData.name}`, errors: null }
}

export async function assignAdmin(formData: FormData) {

}