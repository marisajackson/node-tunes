'use strict';

var multiparty = require('multiparty');
var albums = global.nss.db.collection('albums');
var songs = global.nss.db.collection('songs');
var fs = require('fs');
var mkdirp = require('mkdirp');
var Mongo = require('mongodb');
var _ = require('lodash');

exports.index = (req, res)=>{
  songs.find().toArray((err, songs)=>{
    res.render('songs/index', {songs: songs, title: 'NodeTunes: Songs'});
  });
};

exports.create = (req, res)=>{
  var form = new multiparty.Form();
  form.parse(req,(err, fields, files)=>{
    console.log(files);
    var song = {};
    song.title = fields.title[0];
    song.albumId = Mongo.ObjectID(fields.albumId[0]);
    song.folder = fields.title[0].replace(/\s+/g, '').toLowerCase();
    song.songmp3 = files.songmp3[0].originalFilename;
    albums.find().toArray((err, albums)=>{
        song.album = _(albums).find(alb =>alb._id.toString() === song.albumId.toString());
        mkdirp(`${__dirname}/../static/audios/${song.album.artist.folder}`);
        mkdirp(`${__dirname}/../static/audios/${song.album.artist.folder}/${song.album.folder}`);
        fs.renameSync(files.songmp3[0].path, __dirname+'/../static/audios/'+song.album.artist.folder+'/'+song.album.folder+'/'+song.songmp3);
        songs.save(song,()=>res.redirect('/'));
    });
  });
};
