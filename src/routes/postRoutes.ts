import { Router } from 'express';
import {  PostController } from '../controllers/postcontroller';
import { isLogin } from '../middlewares/islogin';

const router = Router();
const postController = new PostController();

router.get('/getPostByID/:id', postController.getPostById.bind(PostController));
router.post('/createPost/', isLogin, postController.createPost.bind(PostController));
router.put('/updatePost/:id', isLogin, postController.updatePost.bind(PostController));
router.delete('/deletePost/:id', isLogin, postController.deletePost.bind(postController));
router.get('/getAllPosts/', postController.getAllPosts.bind(PostController));
router.post('/upvote/:id/upvote', isLogin, postController.upvotePost.bind(PostController));
router.post('/downvote/:id/downvote', isLogin, postController.downvotePost.bind(PostController));
router.post('/addComment/:id/comments', isLogin, postController.addComment.bind(PostController));
router.get('/getComment/:id/comments', postController.getCommentsForPost.bind(PostController));
router.get('/sort/sorted', postController.getSortedPosts.bind(PostController));
router.get('/filterCategory/category/:categoryId', postController.filterPostsByCategory.bind(PostController));
router.get('/filterPosts/user/:userId', postController.filterPostsByUser.bind(PostController));

export default router;
