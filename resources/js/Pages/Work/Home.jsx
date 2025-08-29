import { useState } from "react";
import WorkHomeTab from "../../components/Navbar/WorkHomeTab";
import WorkLoginPage from "./WorkLogin";
import WorkLayout from "../../Layouts/WorkLayout";
import WorkLogoutPage from "./WorkLogout";
import Timer from "./Timer";

const WorkHomePage = ({ works }) => {
    const [activeTab, setActiveTab] = useState("Login");

    function requestSwitchTab(tabName) {
        setActiveTab(tabName);
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="flex flex-col items-center justify-center">
                {/* Tabs */}
                <WorkHomeTab activeTab={activeTab} requestSwitchTab={requestSwitchTab} />

                {/* Content */}
                <div className="w-full bg-white shadow-lg rounded-2xl p-6">
                    {activeTab === "Login" ? (
                        <WorkLoginPage />
                    ) : (
                        <WorkLogoutPage />
                    )}
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
                {works.map((work, ind) => (
                    <div
                        key={String(work.user.id) + String(ind)}
                        className="flex flex-col items-center bg-white rounded-lg p-4 shadow"
                    >
                        <h3 className="font-semibold mb-2">{work.user.name}</h3>
                        <Timer timeStart={`${work.date}T${work.time_start}`} />
                    </div>
                ))}
            </div>
        </div>
    );
}

WorkHomePage.layout = page => <WorkLayout children={page} />

export default WorkHomePage;