"use server"
import { createClient } from '@/utils/supabase/server';
import { success, z } from 'zod';
import { redirect } from "next/navigation"

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
    document_urls: z.array(z.string().url("Must be valid URL")).default([])
})

export async function checkNameExists(name: string) {

    if (!name || name.length < 2) return false;

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("applications")
        .select("name")
        .ilike("name", name)
        .maybeSingle();

    if (error) {
        console.log("checking error", error)
        return false;
    }

    return !!data;

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
                document_urls: validUrls

            })

        return { success: true, message: "Application Submission Success!" }

    } catch (error) {
        console.error("Parallel upload Error:", error)
        return { success: false, message: "One or more files failed to upload" }
    }
}

export async function authenticateUser(formData: FormData): Promise<void> {
    if (!formData) {
        return;
    }
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (!error) {
        redirect("/dashboard");
    }
}

export async function getSecuredFileURL(filePath: string) {
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