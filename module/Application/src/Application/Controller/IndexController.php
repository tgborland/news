<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2013 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Application\Controller;

use Application\Form\NewsForm;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\Paginator\Paginator;
use Zend\View\Model\JsonModel;
use Zend\View\Model\ViewModel;

class IndexController extends AbstractActionController {
    protected $_pageSize = 5;

    /**
     * @return array
     */
    protected function _getNewsActionData() {
        $page = $this->params()->fromQuery('page', 1);

        $mongo = new \MongoClient();
        $db = $mongo->news;
        $collection = $db->news;

        $cursor = $collection->find()->sort(array('_id' => -1));
        $cursor->skip($this->_pageSize * ($page - 1));
        $cursor->limit($this->_pageSize);

        $paginator = new Paginator(new \Zend\Paginator\Adapter\Null($cursor->count()));
        $paginator->setCurrentPageNumber($page)
            ->setItemCountPerPage($this->_pageSize);

        return array(
            'items' => $cursor,
            'paginator' => $paginator
        );
    }

    public function indexAction() {
        $form = new NewsForm();

        $view = new ViewModel(array(
            'news' => $this->_getNewsActionData(),
            'form' => $form
        ));

        return $view;
    }

    public function resultAction() {
        $view = new ViewModel(array(
            'news' => $this->_getNewsActionData()
        ));

        $view->setTerminal(true); // for partial render
        return $view;
    }

    public function saveAction() {
        $form = new NewsForm();
        $form->setData($this->getRequest()->getQuery());

        $result = array();

        if ($form->isValid()) {
            $data = $form->getData();

            $mongo = new \MongoClient();
            $db = $mongo->news;
            $collection = $db->news;

            if ($collection->insert($data)) {
                $result['ok'] = 1;
            }
        }

        echo json_encode($result);
        exit;
    }

    public function deleteAction() {
        $result = array();
        $id = $this->params()->fromQuery('id', false);

        if ($id) {
            $mongo = new \MongoClient();
            $db = $mongo->news;
            $collection = $db->news;

            if ($collection->remove(array('_id' => new \MongoId($id)))) {
                $result['ok'] = 1;
            }
        }

        echo json_encode($result);
        exit;
    }
}
