export const buttonStyles = {
    primary: "bg-red-600 text-white font-bold text-lg py-3 px-10 rounded-full hover:bg-red-700 transition-all transform hover:scale-105 duration-300 shadow-lg disabled:bg-red-400 disabled:cursor-not-allowed disabled:scale-100",
    secondary: "bg-gray-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-300",
    upload: "cursor-pointer text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
} as const;

export const imageStyles = {
    container: "w-full max-w-xs aspect-square bg-gray-200 rounded-lg overflow-hidden",
    preview: "w-full h-full object-cover",
    withShadow: "shadow-lg",
    withInnerShadow: "shadow-inner"
} as const;

export const layoutStyles = {
    pageContainer: "bg-gray-100 text-gray-800 min-h-screen",
    contentContainer: "container mx-auto p-4 md:p-8 max-w-4xl",
    mainCard: "bg-white rounded-2xl shadow-lg p-6 md:p-8 flex justify-center",
    centerText: "text-center"
} as const;