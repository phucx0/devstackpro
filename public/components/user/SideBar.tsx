export default () => {
    return (
        <div>
            <div className="flex flex-col bg-primary p-2 md:px-4 md:py-0">
                <div className="text-lg text-white font-bold pb-2">Categories</div> 
                <div className="divide-y divide-gray-700/80">
                    <div className="text-white hover:bg-gray-700/10 cursor-pointer p-4">AI</div>
                    <div className="text-white hover:bg-gray-700/10 cursor-pointer p-4">AI</div>
                    <div className="text-white hover:bg-gray-700/10 cursor-pointer p-4">AI</div>
                </div>
                <div className="text-sm text-neutral-300/80 pt-2"></div>
            </div>
        </div>
    )
}