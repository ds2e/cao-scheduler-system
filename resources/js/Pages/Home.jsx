import mainLogo from '+/images/Cao_Laura_ohneText.png'

export default function Home({name}){
    return (
        <div className="h-screen w-full grid place-content-center bg-theme">
            {/* <h1 className="text-red-600 text-center text-6xl">Herzlich willkommen zum</h1> */}
            <img className='w-full object-cover' src={mainLogo} alt='Main Logo' />
        </div>
    )
}