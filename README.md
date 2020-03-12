# Electron-Vue-Pyflix

## Background

Project to create a Netflix-like application for personal use. This would include an indexed registry of films and connect to open APIs to query film information. This was the first project using ElectronJS alongside VueJS to adapt web application development knowledge to building desktop applications. The intended use is to run this from a Raspberry Pi 3 using Raspbian. Later iterations will include recommendation algorithms and usage statistics. 

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Steps to create new Vue-Electron app
* vue create <project-name>
* vue add electron-builder
* npm run electron:serve

### Stack
* VueJS
* ElectronJS

### Packages
* vue-router
* bootstrap-vue
* axios
* moment-js
* electron-storage
* chunk

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Resources for Vue - Electron
* [Getting started video](https://www.youtube.com/watch?v=DymMQb4OaJM)
* [Electron Vue SQLite3 demo](https://github.com/luwanquan/electron-vue-sqlite3-demo)

## APIs
* [IMDB API](https://v2.sg.media-imdb.com/suggests/g/gladiator.json)
* [IMDB Extractors](https://github.com/azcoppen/imdb-extractors)
* [OMDB API](http://www.omdbapi.com/?t=V+For+Vendetta&y=2005&plot=short&r=json)

## Tutorials
* [Electron File Downloads](https://stackoverflow.com/questions/46102851/electron-download-a-file-to-a-specific-location)
* [Using Python in Electron](https://www.techiediaries.com/python-electron-tutorial/)

## Inspiration
* [Popcorn Time Desktop](https://github.com/amilajack/popcorn-time-desktop/)
* [React Clone](https://github.com/biodunch/mini-netflix)

## Database Schema
* ID, Name, Year, Category, MyRating, OnlineRating, ImagePath, FilePath 
* ID, PersonId, ItemId
* ID, Person
* ID, ItemId, DateLastAccessed, AccessCount 
* ID, TopRatedId, WatchAgainId, DeleteId

## Algorithms
* Top Rated: Count of AccessCount by Category
* Watch again: Days since item last viewed > 50
* Deletion suggestions: MyRating < 5 | Days since item last viewed > 100
