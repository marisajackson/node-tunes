'use strict';

var albums = global.nss.db.collection('albums');
var artists = global.nss.db.collection('artists');

exports.index = (req, res)=>{
  artists.find().toArray((err, artists)=>{
    albums.find().toArray((err, albums)=>{
      res.render('home/index', {albums: albums, artists: artists, title: 'NodeTunes: Home'});
    });
  });
};

exports.help = (req, res)=>{
  res.render('home/help', {title: 'Node.js: Help'});
};
