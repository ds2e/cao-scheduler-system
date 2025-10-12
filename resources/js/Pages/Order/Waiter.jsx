import { useState } from "react";
import WaiterLayout from "../../Layouts/WaiterLayout";
import WaiterNavbar from "../../components/Navbar/WaiterNavbar";
import OrderTab from "./Tabs/Order/OrderTab";
import PaymentTab from "./Tabs/Payment/PaymentTab";
import ChooseTableDialog from "../../components/Dialog/ChooseTableDialog";
import { router } from "@inertiajs/react";

const tabs = [
    {
        name: "Order",
        path: "/ZGF0YV9lbmNvZGVkX2hlcmU/order"
    },
    {
        name: "Payment",
        path: "/ZGF0YV9lbmNvZGVkX2hlcmU/payment"
    },
    {
        name: "History",
        path: "/ZGF0YV9lbmNvZGVkX2hlcmU/history"
    },
];

const WaiterPage = ({ taxClasses, categories, tables }) => {

    const [currentActiveTab, setCurrentActiveTab] = useState(tabs[0].name);
    const [currentSelectedTableId, setCurrentSelectedTableId] = useState(tables[0].id);
    const [isOpenChooseTableModal, setIsOpenChooseTableModal] = useState(false);

    function requestSwitchTab(tabName) {
        setCurrentActiveTab(tabName);
    }

    function chooseTable(tableId) {
        setCurrentSelectedTableId(tableId);
        setIsOpenChooseTableModal(false);
    }

    switch (currentActiveTab) {
        case "Order":
            return (
                <>
                    <OrderTab categories={categories} tables={tables} taxClasses={taxClasses} requestChangeTable={() => setIsOpenChooseTableModal(true)} currentSelectedTableId={currentSelectedTableId} />
                    <WaiterNavbar currentActiveTab={currentActiveTab} tabs={tabs} requestSwitchTab={requestSwitchTab} />
                    <ChooseTableDialog isOpen={isOpenChooseTableModal} setOpen={setIsOpenChooseTableModal} tables={tables} chooseTable={chooseTable} />
                </>
            );
            break;
        case "Payment":
            return (
                <>
                    <PaymentTab taxClasses={taxClasses} tables={tables} requestChangeTable={() => setIsOpenChooseTableModal(true)} currentSelectedTableId={currentSelectedTableId} />
                    <WaiterNavbar currentActiveTab={currentActiveTab} tabs={tabs} requestSwitchTab={requestSwitchTab} />
                    <ChooseTableDialog isOpen={isOpenChooseTableModal} setOpen={setIsOpenChooseTableModal} tables={tables} chooseTable={chooseTable} />
                </>
            );
            break;
        case "History":
            return router.visit('/ZGF0YV9lbmNvZGVkX2hlcmU/history')
            break;
        default:
            break;
    }
};

WaiterPage.layout = page => <WaiterLayout children={page} />

export default WaiterPage;