import manifest from '@neos-project/neos-ui-extensibility';

import WhatsNewNotificationModal from './Components/WhatsNewNotificationModal'

manifest('Flowpack.Neos.WhatsNewDashboard:whatsNewNotificationModal', {}, globalRegistry => {
    const containerRegistry = globalRegistry.get('containers');

    containerRegistry.set('Modals/WhatsNewNotificationModal', WhatsNewNotificationModal);
});
