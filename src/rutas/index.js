const {Router}= require('express');
const router =Router();
const {getUsers, createUsers, getUsersByID, deleteUsers, updateUsers} =require('../controladores/index.controlers');

router.get('/users', getUsers);
router.post('/users', createUsers);
router.get('/users/:id', getUsersByID);
router.detele('/users/:id', deleteUsers);
router.put('/users/:id', updateUsers);



module.exports= router;
