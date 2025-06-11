import React from 'react'

type Props = {
    closeModal: () => void
}

const Modal = ({ closeModal }: Props) => {
    return (
        <div className='bg-black' onClick={closeModal}>
            <p>Testingn Blub</p>
        </div>
    )
}

export default React.memo(Modal)
