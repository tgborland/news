<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2013 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\Paginator\Paginator;
use Zend\View\Model\ViewModel;

class IndexController extends AbstractActionController {
    protected $_pageSize = 5;

    public function indexAction() {
        $page = $this->params()->fromQuery('page', 1);

        $mongo = new \MongoClient();
        $db = $mongo->news;
        $collection = $db->news;

        $cursor = $collection->find();
        $cursor->skip($this->_pageSize * ($page - 1));
        $cursor->limit($this->_pageSize);

        $paginator = new Paginator(new \Zend\Paginator\Adapter\Null($cursor->count()));
        $paginator->setCurrentPageNumber($page)
            ->setItemCountPerPage($this->_pageSize);
//            ->setPageRange(7);

        $view = new ViewModel(array(
            'news' => $cursor,
            'paginator' => $paginator)
        );

        // $view->setTerminal(true); // for partial render

        return $view;
    }
}
