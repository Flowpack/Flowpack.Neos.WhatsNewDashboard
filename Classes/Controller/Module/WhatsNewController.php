<?php
namespace Flowpack\Neos\WhatsNewDashboard\Controller\Module;

use Neos\Flow\Annotations as Flow;
use Neos\Fusion\View\FusionView;
use Neos\Neos\Controller\Module\AbstractModuleController;

/**
 * @Flow\Scope("singleton")
 */
class WhatsNewController extends AbstractModuleController
{
    protected $defaultViewObjectName = FusionView::class;

    #[Flow\InjectConfiguration("modules.whats-new.submodules", "Neos.Neos")]
    protected array $submodules;

     /**
     * @return void
     */
    public function indexAction()
    {
        $this->view->assignMultiple([
            'submodules' => $this->submodules
        ]);
    }
}
