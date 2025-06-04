<?php

declare(strict_types=1);

namespace Flowpack\Neos\WhatsNewDashboard\Controller\Module\WhatsNew;

use Neos\Flow\Annotations as Flow;
use Neos\Fusion\View\FusionView;
use Neos\Neos\Controller\Module\AbstractModuleController;

/**
 * @Flow\Scope("singleton")
 * The in project module controller that allows showing news for new features in your project
 */
class InProjectController extends AbstractModuleController
{
    protected $defaultViewObjectName = FusionView::class;

    #[Flow\InjectConfiguration("inProjectSourceUrl", "Flowpack.Neos.WhatsNewDashboard")]
    protected string $inProjectSourceUrl;

    /**
     * @return void
     */
    public function indexAction()
    {
        $this->view->assignMultiple([
            'sourceUrl' => $this->inProjectSourceUrl,
        ]);
    }
}
