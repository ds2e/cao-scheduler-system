export default function WorkHomeTab({ activeTab, requestSwitchTab }) {
    const tabs = [
        { name: "Login" },
        { name: "Logout" }
    ];
    return (
        <div className="flex w-full rounded-full bg-white p-1 mb-4">
            {tabs.map((tab, ind) => {
                const isActive = activeTab === tab.name; // handles query params
                return (
                    <button
                        key={tab.name + ind}
                        onClick={() => requestSwitchTab(tab.name)}
                        className={`flex-1 text-center py-2 px-4 rounded-full font-medium transition-colors duration-200 ${isActive
                            ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-white text-gray-900 hover:bg-gray-100"
                            }`}
                    >
                        {tab.name}
                    </button>
                );
            })}
        </div>
    );
}