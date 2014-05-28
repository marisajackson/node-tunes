'use strict';

var multiparty = require('multiparty');
var artists = global.nss.db.collection('artists');
var fs = require('fs');
var mkdirp = require('mkdirp');
var songs = global.nss.db.collection('songs');
var Mongo = require('mongodb');

exports.index = (req, res)=>{
  artists.find().toArray((err, records)=>{
    res.render('artists/index', {artists: records, title: 'Artists'});
  });
};

exports.show = (req, res)=>{
  var _id = Mongo.ObjectID(req.params.id);
  songs.find({artistId:_id}).toArray((err, songs)=>{
    res.render('artists/show', {songs: songs, title: 'Songs'});
  });
};

exports.create = (req, res)=>{
  var form = new multiparty.Form();
  form.parse(req,(err, fields, files)=>{
    console.log(files);
    var artist = {};
    artist.name = fields.name[0];
    artist.folder = fields.name[0].replace(/\s+/g, '').toLowerCase();
    mkdirp(`${__dirname}/../static/img/${artist.folder}`);
    mkdirp(`${__dirname}/../static/img/${artist.folder}/albums`);
    artist.artistphoto = files.artistphoto[0].originalFilename;
    fs.renameSync(files.artistphoto[0].path, `${__dirname}/../static/img/${artist.folder}/${artist.artistphoto}`);
    artists.save(artist,()=>res.redirect('/'));
  });
};
