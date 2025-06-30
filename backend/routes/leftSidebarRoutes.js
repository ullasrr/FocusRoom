const express = require('express');
const router = express.Router();

import mockData from '../models/leftSidebarModel';

router.get('/',mockData);

export default router;