'use strict';

var multiparty = require('multiparty');
var artists = global.nss.db.collection('artists');
var albums = global.nss.db.collection('albums');
var songs = global.nss.db.collection('songs');
var fs = require('fs');
var mkdirp = require('mkdirp');
var Mongo = require('mongodb');
var _ = require('lodash');

exports.index = (req, res)=>{
  albums.find().toArray((err, albums)=>{
    artists.find().toArray((err, artists)=>{
      res.render('albums/index', {albums: albums, artists: artists, title: 'NodeTunes: Albums'});
    });
  });
};

exports.show = (req, res)=>{
  var _id = Mongo.ObjectID(req.params.id);
  songs.find({albumId:_id}).toArray((err, songs)=>{
    albums.findOne({_id:_id}, (err, album)=>{
      res.render('albums/show', {album: album, songs: songs, title: '${album.title}'});
    });
  });
};

exports.create = (req, res)=>{
  var form = new multiparty.Form();
  form.parse(req,(err, fields, files)=>{
    console.log(files);
    var album = {};
    album.title = fields.title[0];
    album.artistId = Mongo.ObjectID(fields.artistId[0]);
    album.folder = fields.title[0].replace(/\s+/g, '').toLowerCase();
    album.albumphoto = files.albumphoto[0].originalFilename;
    artists.find().toArray((err, artists)=>{
        album.artist = _(artists).find(art =>art._id.toString() === album.artistId.toString());
        mkdirp(`${__dirname}/../static/img/${album.artist.folder}/albums/${album.folder}`);
        fs.renameSync(files.albumphoto[0].path, __dirname+'/../static/img/'+album.artist.folder+'/albums/'+album.folder+'/'+album.albumphoto);
        albums.save(album,()=>res.redirect('/'));
    });
  });
};

exports.search = (req, res)=>{
  var artist = req.query.artist;
  // var obj ={};
  // var name = artist.name;
  // obj[name] = artist;

  albums.find({artist:{$in: artist.name}}).toArray((err, records)=>{
    res.render('artist/index', {albums: records, title: 'Filtered by Artist'});
  });
};
