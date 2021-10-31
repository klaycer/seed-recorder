import React, { useContext } from 'react';
import { ModalContext } from '../../Contexts/ModalProvider';
import { GiArrowCursor } from 'react-icons/gi';
import { RiDragMove2Fill } from 'react-icons/ri';

const ToggleDraggable = () => {
    const contextData = useContext(ModalContext)
    return (
        <div>
            <div className="flex flex-grid justify-center items-center">
                <div className="flex justify-center items-center">
                    <span title="Enable Draggable">
                        <RiDragMove2Fill 
                            className="h-4 w-4 text-gray-500"
                        />
                    </span>
                </div>
                <div className={("cursor-pointer w-12 h-5 flex items-center bg-gray-300 rounded-full mx-3 px-1 ")+(contextData.disableDrag ? 'bg-indigo-400' : '')} onClick={() => contextData.setDisable(!contextData.disableDrag)}>
                    <div className={("bg-white w-3 h-3 rounded-full shadow-md transform ")+(contextData.disableDrag ? 'translate-x-7' : '' )}></div>
                </div>
                <div className="flex justify-center items-center">
                    <span title="Disable Draggable">
                        <GiArrowCursor 
                            className="h-4 w-4 text-gray-400"
                        />
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ToggleDraggable;
