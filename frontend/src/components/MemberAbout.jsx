export default function MemberAbout(){
    return(
        <div className="flex flex-col gap-2 bg-white p-4 rounded-lg shadow-md">
            <div className="font-bold text-gray-800">About</div>
            <p className="text-gray-500">Expireneced software developer with a passion for creating innovative solutions. Specialized in full-stack development with expertise in JavaScript, Python, and cloud technologies</p>
            <div className="flex">
                <div className="flex flex-col mt-2 mr-15 text-sm">
                    <div className="flex flex-col text-gray-500">Location</div>
                    <div className="flex flex-col text-gray-500">San Francisco, CA</div>
                </div>
                <div className="flex flex-col mt-2 ml-30 text-sm">
                    <div className="flex flex-col text-gray-500">Company</div>
                    <div className="flex flex-col text-gray-500">Tech Innovations Inc.</div>
                </div>
            </div>

            <div className="flex">
                <div className="flex flex-col mt-2 mr-10 text-sm">
                    <div className="flex flex-col text-gray-500">Email</div>
                    <div className="flex flex-col text-gray-500">johndoe@gmail.com</div>
                </div>
                <div className="flex flex-col mt-2 ml-30 text-sm">
                    <div className="flex flex-col text-gray-500">Phone</div>
                    <div className="flex flex-col text-gray-500">(555) 123-456</div>
                </div>
            </div>
        </div>
    )
}