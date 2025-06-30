import mockData from '../models/leftSidebarModel';

exports.getData = (req, res) => {
  res.status(200).json(mockData);
};