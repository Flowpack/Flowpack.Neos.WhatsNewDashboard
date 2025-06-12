import React, { useState, useEffect } from 'react'
//@ts-ignore
import { Dialog, Button } from '@neos-project/react-ui-components'

type ApiData = {
    clientNotificationTimestamp: string
}

const WhatsNewNotificationModal = () => {
    const [showModal, setShowModal] = useState<boolean>(false)
    const [apiData, setApiData] = useState<ApiData | null>(null);

    // Fetch data from an API
    const fetchData = async () => {
        try {
            const response = await fetch('/api/whats-new/in-project');
            const data = await response.json();
            setApiData(data);
        } catch (error) {
            console.error('Error fetching API data:', error);
        }
    };

    useEffect(() => {
        const cookies = Object.fromEntries(document.cookie.split('; ').map(c => c.split('=')));

        !apiData && fetchData();

        if (!cookies.whatsNewNoteClosedTimestamp || (apiData && cookies.whatsNewNoteClosedTimestamp < apiData.clientNotificationTimestamp)) {
            setShowModal(true)
        }
    }, [apiData, fetchData])

    const closeModal = () => {
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 5); // 5 years from now

        document.cookie = `whatsNewNoteClosedTimestamp=${Date.now()}; expires=${expires.toUTCString()}; path=/`;
        setShowModal(false)
    }

    const renderClose = () => {
        return (
            <Button
                id="neos-DiscardDialog-Cancel"
                key="cancel"
                style="lighter"
                hoverStyle="brand"
                onClick={closeModal}
            >
                Close
            </Button>
        )
    }

    const handleLinkClick = (e: any) => {
        e.preventDefault() // stop default navigation
        closeModal()
        setTimeout(() => {
            window.location.href = `${window.location.origin}/neos/whats-new/in-project`
        }, 100); // delay to allow React state to update
    }

    return showModal
        ? (
            <>
                <Dialog
                    isOpen={showModal}
                    title="New features"
                    actions={[renderClose()]}
                    type="success"
                    className="whats-new__dialog"
                >
                    <div className='dialog__content'>
                        <p>There are new features available in your project.</p>
                        <p>You can check the <strong>What's new &gt; in project section</strong> in the menu for more details.</p>
                        <p>
                            <a href="#" onClick={handleLinkClick}>Go to 'Whats new in your project'</a>
                        </p>
                    </div>
                </Dialog>
            </>
        )
        : null
}

export default React.memo(WhatsNewNotificationModal)
