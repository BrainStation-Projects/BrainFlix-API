const fs = require('fs');
const express = require('express');
const { v4: uuid } = require('uuid');
const router = express.Router();

// Route /videos
// GET - gets enough video info to pass to the "Next videos"
// POST - adds a new video to the json file
router.route('/')
    .get((req, res) => {
        fs.readFile('./data/videos.json', 'utf-8', (err, data) => {
            if (err) {
                res.status(500).json({
                    message: "Sorry! Something went wrong. Please try again.",
                    error: err
                })
            } else {
                const videoData = JSON.parse(data).map(video => {
                    return {
                        id: video.id,
                        title: video.title,
                        channel: video.channel,
                        image: video.image
                    };
                });
                res.json(videoData);
            }
        });
    })
    .post((req, res) => {
        console.log(req.body);
        const data = fs.readFileSync('./data/videos.json', 'utf-8');
        const videoData = JSON.parse(data);
        if (req.body.title && req.body.description) {
            videoData.push({
                id: uuid(),
                title: req.body.title,
                channel: "Mohan Muruge",
                image: "http://localhost:8081/images/video-placeholder-image.jpg",
                description: req.body.description,
                views: 0,
                likes: 0,
                duration: "3:25",
                video: "https://project-2-api.herokuapp.com/stream",
                timestamp: Date.now(),
                comments: []
            })
            fs.writeFileSync('./data/videos.json', JSON.stringify(videoData));
            res.send("Video uploaded");
        } else {
            res.send("There wasn't any data submitted.")
        }
    })

// Route /videos/:id
// GET - Gets full description of a specific video
router.route('/:id')
    .get((req, res) => {
        const data = fs.readFileSync('./data/videos.json', 'utf-8');
        const videoData = JSON.parse(data);
        res.json(videoData.find(video => video.id === req.params.id))
    })

// Route /videos/:id/comments
// POST - Adds a new comment and saves it to the json file
router.route('/:id/comments')
    .post((req, res) => {
        const data = fs.readFileSync('./data/videos.json', 'utf-8');
        const videoData = JSON.parse(data);
        if (req.body.comment) {

            const foundVideo = videoData.find(video => video.id === req.params.id)

            foundVideo.comments.push({
                id: uuid(),
                name: 'Mohan Muruge',
                comment: req.body.comment,
                timestamp: Date.now()
            })
            fs.writeFileSync('./data/videos.json', JSON.stringify(videoData));
            res.send("Comment submitted");
        } else {
            res.send("There wasn't any data submitted.")
        }

    })

// Route /videos/:videoId/comments/:commentId
// DELETE - removes an specific comment from an specific video 
router.route('/:videoId/comments/:commentId')
    .delete((req, res) => {
        const data = fs.readFileSync('./data/videos.json', 'utf-8');
        const videoData = JSON.parse(data);
        const foundVideo = videoData.find((video) => video.id === req.params.videoId)
        foundVideo.comments = foundVideo.comments.filter((comment) => comment.id !== req.params.commentId)
        fs.writeFileSync('./data/videos.json', JSON.stringify(videoData));
        res.send("Comment deleted");
    })

module.exports = router;
