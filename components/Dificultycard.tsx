import React from 'react'
interface Difficultycardprops {
    level: string,
    description: string,
    selected: boolean,
    onselect: () => void
}
function Dificultycard({ level, description, selected, onselect }: Difficultycardprops) {
    return (
        <div className={`flex flex-col p-4 border border-gray-200 rounded-lg cursor-pointer ${selected ? "ring-2 ring-yellow-500 bg-opacity-10" : "hover:bg-gray-100"}`}
            onClick={onselect}>
            <h2 className={`font-bold text-xl ${selected ? "text-yellow-500" : "text-black"}`}>{level}</h2>
            <p className='text-gray-500'>{description}</p>
        </div>
    )
}

export default Dificultycard