import React, { useState, useEffect } from 'react'
import Modal from './Modal'

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

    return showModal
        ? <Modal closeModal={closeModal} />
        : null
}

export default React.memo(WhatsNewNotificationModal)
