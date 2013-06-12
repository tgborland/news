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
use Zend\Form;

class IndexController extends AbstractActionController {
    protected $_pageSize = 10;

    /**
     * @return array
     */
    protected function _getNewsActionData() {
        $page = $this->params()->fromQuery('page', 1);
        $tags = $this->params()->fromQuery('tags', array());
        $tagIds = array();
        $items = array();
        $where = array();

        $this->_prepareTags($tags);
        foreach ($tags as $tag) {
            $tagIds[] = $tag['$id'];
        }

        $mongo = new \MongoClient();
        $db = $mongo->news;
        $collection = $db->news;

        if (!empty($tagIds)) {
            $where = array('tags' => array(
                '$elemMatch' => array(
                    '$id' => array('$in' => $tagIds)
                )
            ));
        }

        $cursor = $collection
            ->find($where)
            ->sort(array('_id' => -1));


        $cursor->skip($this->_pageSize * ($page - 1));
        $cursor->limit($this->_pageSize);

        foreach($cursor as $item) {
            if (!empty($item['tags']) && is_array($item['tags'])) {
                foreach($item['tags'] as &$tag) {
                    if ($tag = $db->tags->getDBRef($tag)) {
                        $tag = $tag['name'];
                    }
                }
            }
            $item['_id'] = (string) $item['_id'];
            $items[] = $item;
        }

        $paginator = new Paginator(new \Zend\Paginator\Adapter\Null($cursor->count()));
        $paginator->setCurrentPageNumber($page)
            ->setItemCountPerPage($this->_pageSize);

        return array(
            'items' => $items,
            'paginator' => $paginator,
            'count' => $cursor->count()
        );
    }

    /**
     * @param $tags
     */
    protected function _prepareTags(&$tags) {
        $mongo = new \MongoClient();
        $db = $mongo->news;
        $collection = $db->tags;
        $existTags = array();

        foreach($tags as &$tag) {
            $tag = trim($tag);
        }

        unset($tag);

        $cursor = $collection->find(array('name' => array('$in' => $tags)));
        foreach ($cursor as $tag) {
            $existTags[] = $tag['name'];
        }

        $addTags = array_diff($tags, $existTags);
        foreach ($addTags as $tag) {
            $result = $collection->insert(array('name' => $tag));
        }

        foreach ($tags as &$tag) {
            $el = $collection->findOne(array('name' => $tag));
            $tag = $collection->createDBRef($el);
        }
    }

    /**
     * @return array|ViewModel
     */
    public function indexAction() {
        $form = new NewsForm();

        $view = new ViewModel(array(
            'news' => $this->_getNewsActionData(),
            'form' => $form
        ));

        return $view;
    }

    /**
     * @return ViewModel
     */
    public function resultAction() {
        $form = new NewsForm();

        $view = new ViewModel(array(
            'news' => $this->_getNewsActionData(),
            'form' => $form
        ));

        $view->setTerminal(true); // for partial render
        return $view;
    }

    public function tagsAction() {
        $tags = array();

        $mongo = new \MongoClient();
        $db = $mongo->news;
        $collection = $db->tags;
        $cursor = $collection->find();

        foreach ($cursor as $tag) {
            $tags[] = $tag['name'];
        }

        echo json_encode($tags);
        exit;
    }

    public function resultJsonAction() {
        $result = $this->_getNewsActionData();

        echo json_encode(array(
            'items' => $result['items'],
            'total' => $result['count'],
            'success' => true,
        ));
        exit;
    }

    /**
     *
     */
    public function saveAction() {
        $form = new NewsForm();
        $form->setData($this->getRequest()->getPost());
        $id = $this->params()->fromPost('_id', false);

        $result = array();

        if ($form->isValid()) {
            $data = $form->getData();

            $mongo = new \MongoClient();
            $db = $mongo->news;
            $news = $db->news;

            $this->_prepareTags($data['tags']);

            if ($id) {
                if ($news->update(array('_id' => new \MongoId($id)), $data)) {
                    $result['ok'] = 1;
                }
            } else {
                if ($news->insert($data)) {
                    $result['ok'] = 1;
                }
            }
        }

        echo json_encode($result);
        exit;
    }

    /**
     *
     */
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
