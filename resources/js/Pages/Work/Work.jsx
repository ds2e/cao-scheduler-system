import WorkLayout from "../../Layouts/WorkLayout";
import Timer from "./Timer";

const WorkWorkPage = ({ works }) => {
    console.log(works)
    if (works.length <= 0) {
        return <div className="h-screen flex items-center justify-center">
            <h2>Niemand ist gerade in Arbeit!</h2>
        </div>
    }

    return (
        <div className="pt-16">
            <div className="grid grid-cols-3 gap-4 p-6">
                {works.map((work, ind) => (
                    <div
                        key={String(work.user.id) + String(ind)}
                        className="flex flex-col items-center bg-white rounded-lg p-4 shadow"
                    >
                        <h3 className="font-semibold mb-2">{work.user.name}</h3>
                        {/* <h4 className="text-theme-secondary mb-2">{work.user.PIN}</h4> */}
                        <Timer timeStart={`${work.date}T${work.time_start}`} />
                    </div>
                ))}
            </div>
        </div>
    )
}

WorkWorkPage.layout = page => <WorkLayout children={page} />

export default WorkWorkPage;