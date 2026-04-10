import style from "./page.module.css";
import { createClient } from "@/utils/supabase/server";
import FileButtons from "./_components/FileButtons/FileButtons";
import ActionButtons from "./_components/ActionButtons/ActionButtons";

interface DetailPageProps {
    params: Promise<{ id: string }>
}

export default async function RecordDetailsPage({ params }: DetailPageProps) {

    const { id } = await params;

    const supabase = await createClient();

    const { data: profile, error } = await supabase
        .from("applications")
        .select("*")
        .eq("id", id)
        .single();

    return (
        <div className={style.mainDiv}>
            <FileButtons
                name={profile.name}
                status={profile.status}
                enrollPath={profile.document_urls[0]}
                gradePath={profile.document_urls[1]}
                idPath={profile.document_urls[2]}
            />
            <ActionButtons />
        </div>
    )
}