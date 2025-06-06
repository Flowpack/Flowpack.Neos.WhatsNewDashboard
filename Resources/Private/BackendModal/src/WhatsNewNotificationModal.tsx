import React, { PureComponent, useState, useEffect } from 'react'


const WhatsNewNotificationModal: PureComponent = () => {
    const [showModal, setShowModal] = useState(false)
    const [apiData, setApiData] = useState(null);

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

    return showModal
        ? (
            <div style={{background: '#000'}} onClick={closeModal}>
                <p>Testingn Blub</p>
            </div>
        )
        : null
}

export default WhatsNewNotificationModal
