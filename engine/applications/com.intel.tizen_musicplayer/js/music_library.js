/** 
 * @module MusicPlayer
 */

/**
 * Class which provides methods to operate with music library
 * @class MusicLibrary
 * @static
 */
var MusicLibrary = {
        /**
         * Holds status of music library initialization.
         * @property initialized {Boolean}
         */
        initialized: false,
        /** 
         * Method is initializing music library.
         * @method init
        */
        init: function () {
            $('#musicLibrary').library("setSectionTitle", "MUSIC LIBRARY");
            $('#musicLibrary').library("init");

            var tabMenuItems = [{
                text: "ARTISTS",
                selected: true
            }, {
                text: "ALBUMS",
                selected: false
            }, {
                text: "PLAYLISTS",
                selected: false
            }];

            var tabMenuModel = {
                    Tabs: tabMenuItems
                };
            $('#library').library("setAlphabetVisible", true);
            $('#musicLibrary').library("tabMenuTemplateCompile", tabMenuModel);
            $('#musicLibrary').bind('eventClick_GridViewBtn', function () {
                $('#musicLibrary').library('changeContentClass', "musicLibraryContentGrid");
            });
            $('#musicLibrary').bind('eventClick_ListViewBtn', function () {
                $('#musicLibrary').library('changeContentClass', "musicLibraryContentList");
            });
            $('#musicLibrary').bind('eventClick_SearchViewBtn', function () {
            });
            $('#musicLibrary').bind('eventClick_menuItemBtn', function (e, data) {
                MusicLibrary.renderTabContent(data.Index);
            });
            $('#musicLibrary').bind('eventClick_closeSubpanel', function () {
            });
            MusicLibrary.renderTabContent($('#musicLibrary').library('getSelectetTopTabIndex'));
            MusicLibrary.initialized = true;
            MusicLibrary.show();
        },
        /** 
         * Method unhiding of music library panel.
         * @method show
        */
        show: function () {
            $('#musicLibrary').library("showPage");
        },
        renderTabContent: function (tabIndex) {
            switch (tabIndex) {
            case 0:
                MusicLibrary.showArtists();
                break;
            case 1:
                MusicLibrary.showAlbums(ALL_ARTISTS);
                break;
            case 2:
                MusicLibrary.showSongs(ALL_ALBUMS, ALL_ARTISTS);
                break;
            default:
                break;
            }
        },
        /** 
         * Method provides rendering artists.
         * @method renderArtists
        */
        renderArtists: function () {
            $('#musicLibrary').library('closeSubpanel');
            var artistsList = getArtistsList(),
                i = 0;
            for (i = 0; i < artistsList.length; i++) {
                artistsList[i].albumsCount = getAlbums(artistsList[i].artist).length;
                artistsList[i].musicCount = getSongsOfArtist(artistsList[i].artist).length;
            }
            $('#musicLibrary').library("setContentDelegate", "templates/libraryArtistsListDelegate.html");
            return artistsList;
        },
        /** 
         * Method provides rendering artists grid view.
         * @method renderArtistsGridView
        */
        renderArtistsGridView: function () {
            $('#musicLibrary').library("contentTemplateCompile", this.renderArtists(), "musicLibraryContentGrid");
        },
        /** 
         * Method provides rendering artists list view.
         * @method renderArtistsListView
        */
        renderArtistsListView: function () {
            $('#musicLibrary').library("contentTemplateCompile", this.renderArtists(), "musicLibraryContentList");
        },
        /** 
          * Method provides rendering albums.
          * @method renderAlbums
        */
        renderAlbums: function (artistName) {
            var albumsList = getAlbums(artistName),
                i = 0;
            for (i = 0; i < albumsList.length; i++) {
                albumsList[i].artistName = artistName;
            }
            if (artistName == ALL_ARTISTS) {
                $('#musicLibrary').library('closeSubpanel');
            } else {
                var subpanelModel = {
                        action: "MusicLibrary.showArtists();",
                        actionName: "BACK",
                        textTitle: "ARTIST",
                        textSubtitle: artistName ? artistName.toUpperCase() : "-"
                    };
                $('#musicLibrary').library("subpanelContentTemplateCompile", subpanelModel, function () {
                    $("#libraryTopSubPanelTitle").boxCaptionPlugin('initSmall', subpanelModel.textTitle);
                });
                $('#musicLibrary').library('showSubpanel');
            }
            $('#musicLibrary').library("setContentDelegate", "templates/libraryAlbumsListDelegate.html");
            return albumsList;
        },
        /**
          * Method provides rendering grid view for albums.
          * @method renderAlbumsGridView
        */
        renderAlbumsGridView: function (artistName) {
            $('#musicLibrary').library("contentTemplateCompile", this.renderAlbums(artistName), "musicLibraryContentGrid");
        },
        /** 
          * Method provides rendering list view for albums.
          * @method renderAlbumsListView
        */
        renderAlbumsListView: function (artistName) {
            $('#musicLibrary').library("contentTemplateCompile", this.renderAlbums(artistName), "musicLibraryContentList");
        },
        /** 
          * Method provides rendering songs.
          * @method renderSongs
        */
        renderSongs: function (albumName, artistName) {
            var songsList = getSongsOfAlbums(albumName),
                i = 0;
            for (i = 0; i < songsList.length; i++) {
                songsList[i].index = i;
                songsList[i].albumName = albumName;
            }
            if (albumName == ALL_ALBUMS) {
                $('#musicLibrary').library('closeSubpanel');
            } else {
                var subpanelModel =	{
                        action: "MusicLibrary.showAlbums('" + artistName + "');",
                        actionName: "BACK",
                        textTitle: "ALBUM",
                        textSubtitle: albumName ? albumName.toUpperCase() : "-"
                    };
                $('#musicLibrary').library("subpanelContentTemplateCompile", subpanelModel, function () {
                    $("#libraryTopSubPanelTitle").boxCaptionPlugin('initSmall', subpanelModel.textTitle);
                });
                $('#musicLibrary').library('showSubpanel');
            }
            $('#musicLibrary').library("setContentDelegate", "templates/librarySongsListDelegate.html");
            return songsList;
        },
        /** 
          * Method provides rendering grid of songs view.
          * @method renderSongsGridView
        */
        renderSongsGridView: function (albumName, artistName) {
            $('#musicLibrary').library("contentTemplateCompile", this.renderSongs(albumName, artistName), "musicLibraryContentGrid");
        },
        /** 
          * Method provides rendering list of songs view.
          * @method renderSongsListView
        */
        renderSongsListView: function (albumName, artistName) {
            $('#musicLibrary').library("contentTemplateCompile", this.renderSongs(albumName, artistName), "musicLibraryContentList");
        },
        /** 
          * Method provides rendering search view.
          * @method renderSearchView
        */
        renderSearchView: function () {
            $('#musicLibrary').library("clearContent");
        },
        /** 
          * Method shows set of artists in grid view or list view.
          * @method showArtists
        */
        showArtists: function () {
            switch ($('#musicLibrary').library('getSelectetLeftTabIndex')) {
            case GRID_TAB:
                MusicLibrary.renderArtistsGridView();
                break;
            case LIST_TAB:
                MusicLibrary.renderArtistsListView();
                break;
            default:
                break;
            }
        },
        /** 
          * Method shows set of albums in grid view or list view.
          * @method showAlbums
        */
        showAlbums: function (artistName) {
            switch ($('#musicLibrary').library('getSelectetLeftTabIndex')) {
            case GRID_TAB:
                MusicLibrary.renderAlbumsGridView(artistName);
                break;
            case LIST_TAB:
                MusicLibrary.renderAlbumsListView(artistName);
                break;
            default:
                break;
            }
        },
        /** 
          * Method shows set of songs in grid view or list view.
          * @method showSongs
        */
        showSongs: function (albumName, artistName) {
            switch ($('#musicLibrary').library('getSelectetLeftTabIndex')) {
            case GRID_TAB:
                MusicLibrary.renderSongsGridView(albumName, artistName);
                break;
            case LIST_TAB:
                MusicLibrary.renderSongsListView(albumName, artistName);
                break;
            default:
                break;
            }
        }
    };