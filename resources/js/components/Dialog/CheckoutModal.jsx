// import ConfirmCheckoutModal from '@/app/components/modals/ConfirmCheckoutModal';
import {
    Dialog,
    DialogContent,
    CustomDialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import dayjs from 'dayjs';
import checkoutLogo from '+/images/bill_logo.png'
import { useEffect, useMemo, useState } from 'react';

export function useOrientation() {
    const [isPortrait, setIsPortrait] = useState(window.innerHeight >= window.innerWidth);

    useEffect(() => {
        const onResize = () => {
            const portrait = window.innerHeight >= window.innerWidth;
            setIsPortrait(portrait);
        };

        // Run once on mount
        onResize();

        // Listen to window resize
        window.addEventListener("resize", onResize);

        // Cleanup listener on unmount
        return () => {
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return { isPortrait, width: window.innerWidth, height: window.innerHeight };
}

export default function CheckoutModal({ setOpen, isOpen, itemsList, taxClasses, tableName, isPending, onSaveBill, onDiscardBill }) {

    const MarginModal = 50;

    const { isPortrait, width, height } = useOrientation();


    const sumCurrentCheckout = useMemo(() => {
        return itemsList.reduce((total, item) => {
            const amount = Number(item.amount) || 0;
            const price = Number(item.price) || 0;
            return total + amount * price;
        }, 0);
    }, [itemsList]);

    const randomBillNum = useMemo(() => {
        return Math.floor(10000 + Math.random() * 30000);
    }, [itemsList])

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setOpen}>
                <CustomDialogContent customClose={false} className={`flex flex-col ${isPortrait ? "" : "-rotate-90"} items-center justify-center bg-transparent p-6 gap-4`}>
                    <div className={`bg-white rounded-md items-center justify-center w-full ${isPortrait ? "overflow-y-auto max-h-[90dvh]" : "overflow-x-auto max-h-[90dvw]"}`}>
                        <div className={`flex flex-col justify-center items-center gap-y-4 py-4 px-8`}>
                            <img className="w-24 aspect-square" src={checkoutLogo} />
                            <DialogTitle className="font-semibold text-3xl" style={{ fontFamily: 'Inconsolata' }}>
                                Cáo Bar & Restaurant
                            </DialogTitle>
                            <div className="flex flex-col items-center">
                                <p className="font-inconsolata">Dresdener Straße 51</p>
                                <p className="font-inconsolata">04317 Leipzig</p>
                                <p className="font-inconsolata">Tel: 0341 68672084</p>
                                <p className="font-inconsolata">Email: info@cao-leipzig.de</p>
                                <p className="font-inconsolata">Web: www.cao-leipzig.de</p>
                                <p className="font-inconsolata">Str.Nr: 231/44/0179</p>
                            </div>
                            <div style={{ width: (!isPortrait) ? 0.9 * height - MarginModal : 0.9 * width - MarginModal }} className="flex flex-col items-start">
                                <p className="font-inconsolata">Rechnung</p>
                                <p className="font-inconsolata">Belegnummer: {randomBillNum}</p>
                                <p className="font-inconsolata">Datum: {dayjs().format('DD/MM/YYYY HH:mm:ss')}</p>
                                <p className="font-inconsolata">Zahlungsart: Barzahlung</p>
                                <p className="font-inconsolata">Währung: Euro</p>
                                <p className="font-inconsolata">Tisch: {tableName}</p>
                            </div>
                            <div className="flex flex-row pb-4 border-b-2 border-themeHighlight" style={{ width: (!isPortrait) ? 0.9 * height - MarginModal : 0.9 * width - MarginModal }}>
                                <p className="font-inconsolata font-bold text-center w-1/6">ME</p>
                                <p className="font-inconsolata font-bold text-center w-2/6">Produktname</p>
                                <p className="font-inconsolata font-bold text-center w-1/4">EP</p>
                                <p className="font-inconsolata font-bold text-center w-1/4">GP</p>
                            </div>
                            {itemsList.map((item, index) => {
                                const gesamtItemPrice = Number(item.amount * item.price);
                                return (
                                    <div key={index} className={`flex flex-row items-center justify-center ${index == itemsList.length - 1 && 'border-b-2 border-themeHighlight pb-4'}`} style={{ width: (!isPortrait) ? 0.9 * height - MarginModal : 0.9 * width - MarginModal }}>
                                        <p className="font-inconsolata text-center w-1/6">{item.amount}</p>
                                        <p className="font-inconsolata text-center w-2/6">{item.name} {item.code && <span className='font-bold text-sm'>({item.code})</span>}</p>
                                        <p className="font-inconsolata text-center w-1/4">{Number(item.price).toFixed(2)}</p>
                                        <p className="font-inconsolata text-center w-1/4">{gesamtItemPrice.toFixed(2)} {taxClasses.find((t_c) => t_c.id == item.item_class)?.name}</p>
                                    </div>
                                )
                            })}

                            <div className='' style={{ width: (!isPortrait) ? 0.9 * height - MarginModal : 0.9 * width - MarginModal }}>
                                <p style={{ fontFamily: 'Inconsolata' }} className='text-5xl text-end'>SUMME: {Number(sumCurrentCheckout).toFixed(2)}&euro;</p>
                            </div>

                            <div className="flex flex-row pt-4" style={{ width: (!isPortrait) ? 0.9 * height - MarginModal : 0.9 * width - MarginModal }}>
                                <p className="font-inconsolata font-bold text-center w-1/6"></p>
                                <p className="font-inconsolata font-bold text-center w-1/5">MwSt</p>
                                <p className="font-inconsolata font-bold text-center w-1/5">Brutto</p>
                                <p className="font-inconsolata font-bold text-center w-1/5">Netto</p>
                                <p className="font-inconsolata font-bold text-center w-1/5">enth.</p>
                            </div>
                            {taxClasses.map((taxClass, tc_ind) => {
                                const itemsInClass = itemsList.filter(item => item.item_class === taxClass.id);

                                // Sum Brutto (total before splitting tax)
                                const brutto = itemsInClass.reduce(
                                    (sum, item) => sum + item.price * item.amount,
                                    0
                                );

                                const rate = taxClass.rate ? taxClass.rate / 100 : 0;
                                const netto = (1 - rate) * brutto;
                                const enthalten = brutto - netto;

                                return (
                                    <div key={"Tax" + tc_ind} className="flex flex-row" style={{ width: (!isPortrait) ? 0.9 * height - MarginModal : 0.9 * width - MarginModal }}>
                                        {[
                                            taxClass.name,
                                            (taxClass.rate ? taxClass.rate : 0) + '%',
                                            new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(
                                                brutto,
                                            ),
                                            new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(
                                                netto,
                                            ),
                                            new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(
                                                enthalten,
                                            )
                                        ].map((header, index) => {
                                            return (
                                                <p key={header + index} className={`text-center font-inconsolata ${index == 0 ? "w-1/6" : "w-1/5"}`}>{header}</p>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className={`flex-row gap-4 justify-center items-center space-x-2`}>
                        <button
                            onClick={onSaveBill}
                            className="border border-green-500 rounded-full p-1.5 cursor-pointer hover:bg-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width={28} height={28} className="fill-green-500">
                                <path d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z" />
                            </svg>
                        </button>
                        <button
                            onClick={onDiscardBill}
                            className="border border-red-500 rounded-full p-2 cursor-pointer hover:bg-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width={24} height={24} className="fill-red-500">
                                <path d="M232.7 69.9C237.1 56.8 249.3 48 263.1 48L377 48C390.8 48 403 56.8 407.4 69.9L416 96L512 96C529.7 96 544 110.3 544 128C544 145.7 529.7 160 512 160L128 160C110.3 160 96 145.7 96 128C96 110.3 110.3 96 128 96L224 96L232.7 69.9zM128 208L512 208L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 208zM216 272C202.7 272 192 282.7 192 296L192 488C192 501.3 202.7 512 216 512C229.3 512 240 501.3 240 488L240 296C240 282.7 229.3 272 216 272zM320 272C306.7 272 296 282.7 296 296L296 488C296 501.3 306.7 512 320 512C333.3 512 344 501.3 344 488L344 296C344 282.7 333.3 272 320 272zM424 272C410.7 272 400 282.7 400 296L400 488C400 501.3 410.7 512 424 512C437.3 512 448 501.3 448 488L448 296C448 282.7 437.3 272 424 272z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setOpen(false)}
                            className="border border-white rounded-full p-1.5 cursor-pointer hover:bg-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width={28} height={28} className="fill-gray-300">
                                <path d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM231 231C240.4 221.6 255.6 221.6 264.9 231L319.9 286L374.9 231C384.3 221.6 399.5 221.6 408.8 231C418.1 240.4 418.2 255.6 408.8 264.9L353.8 319.9L408.8 374.9C418.2 384.3 418.2 399.5 408.8 408.8C399.4 418.1 384.2 418.2 374.9 408.8L319.9 353.8L264.9 408.8C255.5 418.2 240.3 418.2 231 408.8C221.7 399.4 221.6 384.2 231 374.9L286 319.9L231 264.9C221.6 255.5 221.6 240.3 231 231z" />
                            </svg>
                        </button>
                    </div>
                </CustomDialogContent>
            </Dialog>
        </>
    )
}