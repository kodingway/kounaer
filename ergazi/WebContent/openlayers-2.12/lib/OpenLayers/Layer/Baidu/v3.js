﻿/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


/**
 * @requires OpenLayers/Layer/Baidu.js
 */

/**
 * Constant: OpenLayers.Layer.Google.v3
 * 
 * Mixin providing functionality specific to the Google Maps API v3.
 * 
 * To use this layer, you must include the GMaps v3 API in your html.
 * 
 * Because OpenLayers needs to control mouse events, it isolates the GMaps mapObject
 * (the DOM elements provided by Google) using the EventPane.
 * However, because the Terms of Use require some of those elements,
 * such as the links to Google's terms, to be clickable, these elements have 
 * to be moved up to OpenLayers' container div. There is however no easy way
 * to identify these, and the logic (see the repositionMapElements function
 * in the source) may need to be changed if Google changes them.
 * These elements are not part of the published API and can be changed at any time,
 * so a given OpenLayers release can only guarantee support for the 'frozen'
 * Google release at the time of the OpenLayers release. See
 * https://developers.google.com/maps/documentation/javascript/basics#Versioning
 * for Google's current release cycle.
 * 
 * For this reason, it's recommended that production code specifically loads 
 * the current frozen version, for example:
 *
 * (code)
 * <script src="http://maps.google.com/maps/api/js?v=3.7&amp;sensor=false"></script>
 * (end)
 * 
 * but that development code should use the latest 'nightly' version, so that any
 * problems can be dealt with as soon as they arise, and before they affect the production, 'frozen', code.
 * 
 * Note, however, that frozen versions are retired as part of Google's release
 * cycle, and once this happens, you will get the next version, in the example above, 3.8 once 3.7 is retired.
 * 
 * This version supports 3.7.
 * 
 * 
 * Note that this layer configures the google.maps.map object with the
 * "disableDefaultUI" option set to true. Using UI controls that the Google
 * Maps API provides is not supported by the OpenLayers API.
 */
OpenLayers.Layer.Baidu.v3 = {
    
    /**
     * Constant: DEFAULTS
     * {Object} It is not recommended to change the properties set here. Note
     * that Google.v3 layers only work when sphericalMercator is set to true.
     * 
     * (code)
     * {
     *     sphericalMercator: true,
     *     projection: "EPSG:900913"
     * }
     * (end)
     */
    DEFAULTS: {
        sphericalMercator: true,
        //projection: "EPSG:900913"
        	projection: "EPSG:102113"
    },

    /**
     * APIProperty: animationEnabled
     * {Boolean} If set to true, the transition between zoom levels will be
     *     animated (if supported by the GMaps API for the device used). Set to
     *     false to match the zooming experience of other layer types. Default
     *     is true. Note that the GMaps API does not give us control over zoom
     *     animation, so if set to false, when zooming, this will make the
     *     layer temporarily invisible, wait until GMaps reports the map being
     *     idle, and make it visible again. The result will be a blank layer
     *     for a few moments while zooming.
     */
    animationEnabled: true, 

    /** 
     * Method: loadMapObject
     * Load the GMap and register appropriate event listeners. If we can't 
     *     load GMap2, then display a warning message.
     */
    loadMapObject:function() {
        if (!this.type) {
            this.type = BMAP_NORMAL_MAP;
        }
        var mapObject;
        var cache = OpenLayers.Layer.Baidu.cache[this.map.id];
        if (cache) {
            // there are already Google layers added to this map
            mapObject = cache.mapObject;
            // increment the layer count
            ++cache.count;
        } else {
            // this is the first Google layer for this map

            var container = this.map.viewPortDiv;
            var div = document.createElement("div");
            div.id = this.map.id + "_BMapContainer";
            div.style.position = "absolute";
            div.style.width = "100%";
            div.style.height = "100%";
            container.appendChild(div);

            mapObject = new BMap.Map(div);
			
            // cache elements for use by any other google layers added to
            // this same map
            cache = {
                mapObject: mapObject,
                count: 1
            };
            OpenLayers.Layer.Baidu.cache[this.map.id] = cache;
            this.repositionListener = function(){
                OpenLayers.Function.bind(this.repositionMapElements, this)
            };
			mapObject.addEventListener("moveend",this.repositionListener);
        }
        this.mapObject = mapObject;
        this.setBMapVisibility(this.visibility);
    },
    
    /**
     * Method: repositionMapElements
     *
     * Waits until powered by and terms of use elements are available and then
     * moves them so they are clickable.
     */
    repositionMapElements: function() {

        // This is the first time any Google layer in this mapObject has been
        // made visible.  The mapObject needs to know the container size.
        //google.maps.event.trigger(this.mapObject, "resize");
        
        var div = this.mapObject.getDiv().firstChild;
        if (!div || div.childNodes.length < 3) {
            this.repositionTimer = window.setTimeout(
                OpenLayers.Function.bind(this.repositionMapElements, this),
                250
            );
            return false;
        }

        var cache = OpenLayers.Layer.Baidu.cache[this.map.id];
        var container = this.map.viewPortDiv;
        
        // move the ToS and branding stuff up to the container div
        // depends on value of zIndex, which is not robust
        for (var i=div.children.length-1; i>=0; --i) {
            if (div.children[i].style.zIndex == 1000001) {
                var termsOfUse = div.children[i];
                container.appendChild(termsOfUse);
                termsOfUse.style.zIndex = "1100";
                termsOfUse.style.bottom = "";
                termsOfUse.className = "olLayerBaiduCopyright olLayerBaiduV3";
                termsOfUse.style.display = "";
                cache.termsOfUse = termsOfUse;
            }
            if (div.children[i].style.zIndex == 1000000) {
                var poweredBy = div.children[i];
                container.appendChild(poweredBy);
                poweredBy.style.zIndex = "1100";
                poweredBy.style.bottom = "";
                poweredBy.className = "olLayerBaiduPoweredBy olLayerBaiduV3 gmnoprint";
                poweredBy.style.display = "";
                cache.poweredBy = poweredBy;
            }
            if (div.children[i].style.zIndex == 10000002) {
                container.appendChild(div.children[i]);
            }
        }

        this.setBMapVisibility(this.visibility);

    },

    /**
     * APIMethod: onMapResize
     */
    onMapResize: function() {
        if (this.visibility) {
            google.maps.event.trigger(this.mapObject, "resize");
        } else {
            var cache = OpenLayers.Layer.Google.cache[this.map.id];
            if (!cache.resized) {
                var layer = this;
                google.maps.event.addListenerOnce(this.mapObject, "tilesloaded", function() {
                    google.maps.event.trigger(layer.mapObject, "resize");
                    layer.moveTo(layer.map.getCenter(), layer.map.getZoom());
                    delete cache.resized;
                });
            }
            cache.resized = true;
        }
    },

    /**
     * Method: setGMapVisibility
     * Display the GMap container and associated elements.
     * 
     * Parameters:
     * visible - {Boolean} Display the GMap elements.
     */
    setBMapVisibility: function(visible) {
        var cache = OpenLayers.Layer.Baidu.cache[this.map.id];
        if (cache) {
            var type = this.type;
            var layers = this.map.layers;
            var layer;
            for (var i=layers.length-1; i>=0; --i) {
                layer = layers[i];
                if (layer instanceof OpenLayers.Layer.Baidu &&
                            layer.visibility === true && layer.inRange === true) {
                    type = layer.type;
                    visible = true;
                    break;
                }
            }
            var container = this.mapObject.getContainer();
            if (visible === true) {
                this.mapObject.setMapType(eval(this.type));                
                container.style.left = "";
                if (cache.termsOfUse && cache.termsOfUse.style) {
                    cache.termsOfUse.style.left = "";
                    cache.termsOfUse.style.display = "";
                    cache.poweredBy.style.display = "";            
                }
                cache.displayed = this.id;
            } else {
                delete cache.displayed;
                container.style.left = "-9999px";
                if (cache.termsOfUse && cache.termsOfUse.style) {
                    cache.termsOfUse.style.display = "none";
                    // move ToU far to the left in addition to setting
                    // display to "none", because at the end of the GMap
                    // load sequence, display: none will be unset and ToU
                    // would be visible after loading a map with a google
                    // layer that is initially hidden. 
                    cache.termsOfUse.style.left = "-9999px";
                    cache.poweredBy.style.display = "none";
                }
            }
        }
    },
    
    /**
     * Method: getMapContainer
     * 
     * Returns:
     * {DOMElement} the GMap container's div
     */
    getMapContainer: function() {
        return this.mapObject.getContainer();
    },
    
  //
  // TRANSLATION: MapObject Bounds <-> OpenLayers.Bounds
  //

    /**
     * APIMethod: getMapObjectBoundsFromOLBounds
     * 
     * Parameters:
     * olBounds - {<OpenLayers.Bounds>}
     * 
     * Returns:
     * {Object} A MapObject Bounds, translated from olBounds
     *          Returns null if null value is passed in
     */
    getMapObjectBoundsFromOLBounds: function(olBounds) {
        var moBounds = null;
        if (olBounds != null) {
            var sw = this.sphericalMercator ? 
              this.inverseMercator(olBounds.bottom, olBounds.left) : 
              new OpenLayers.LonLat(olBounds.bottom, olBounds.left);
            var ne = this.sphericalMercator ? 
              this.inverseMercator(olBounds.top, olBounds.right) : 
              new OpenLayers.LonLat(olBounds.top, olBounds.right);
            moBounds = new BMap.Bounds(
                new BMap.Point(sw.lon,sw.lat),
                new BMap.Point(ne.lon,ne.lat)
            );
        }
        return moBounds;
    },


    /************************************
     *                                  *
     *   MapObject Interface Controls   *
     *                                  *
     ************************************/


  // LonLat - Pixel Translation
  
    /**
     * APIMethod: getMapObjectLonLatFromMapObjectPixel
     * 
     * Parameters:
     * moPixel - {Object} MapObject Pixel format
     * 
     * Returns:
     * {Object} MapObject LonLat translated from MapObject Pixel
     */
    getMapObjectLonLatFromMapObjectPixel: function(moPixel) {
        var size = this.map.getSize();
        var lon = this.getLongitudeFromMapObjectLonLat(this.mapObject.center);
        var lat = this.getLatitudeFromMapObjectLonLat(this.mapObject.center);
        var res = this.map.getResolution();

        var delta_x = moPixel.x - (size.w / 2);
        var delta_y = moPixel.y - (size.h / 2);
    
        var lonlat = new OpenLayers.LonLat(
            lon + delta_x * res,
            lat - delta_y * res
        ); 

        if (this.wrapDateLine) {
            lonlat = lonlat.wrapDateLine(this.maxExtent);
        }
        return this.getMapObjectLonLatFromLonLat(lonlat.lon, lonlat.lat);
    },

    /**
     * APIMethod: getMapObjectPixelFromMapObjectLonLat
     * 
     * Parameters:
     * moLonLat - {Object} MapObject LonLat format
     * 
     * Returns:
     * {Object} MapObject Pixel transtlated from MapObject LonLat
     */
    getMapObjectPixelFromMapObjectLonLat: function(moLonLat) {
        var lon = this.getLongitudeFromMapObjectLonLat(moLonLat);
        var lat = this.getLatitudeFromMapObjectLonLat(moLonLat);
        var res = this.map.getResolution();
        var extent = this.map.getExtent();
        return this.getMapObjectPixelFromXY((1/res * (lon - extent.left)),
                                            (1/res * (extent.top - lat)));
    },

  
    /** 
     * APIMethod: setMapObjectCenter
     * Set the mapObject to the specified center and zoom
     * 
     * Parameters:
     * center - {Object} MapObject LonLat format
     * zoom - {int} MapObject zoom format
     */
    setMapObjectCenter: function(center, zoom) {
        if (this.animationEnabled === false && zoom != this.mapObject.zoom) {
            var mapContainer = this.getMapContainer();
            google.maps.event.addListenerOnce(
                this.mapObject, 
                "idle", 
                function() {
                    mapContainer.style.visibility = "";
                }
            );
            mapContainer.style.visibility = "hidden";
        }
        this.mapObject.centerAndZoom(center,zoom);
    },
   
    
  // Bounds
  
    /** 
     * APIMethod: getMapObjectZoomFromMapObjectBounds
     * 
     * Parameters:
     * moBounds - {Object} MapObject Bounds format
     * 
     * Returns:
     * {Object} MapObject Zoom for specified MapObject Bounds
     */
    getMapObjectZoomFromMapObjectBounds: function(moBounds) {
        return this.mapObject.getBoundsZoomLevel(moBounds);
    },

    /************************************
     *                                  *
     *       MapObject Primitives       *
     *                                  *
     ************************************/


  // LonLat
    
    /**
     * APIMethod: getMapObjectLonLatFromLonLat
     * 
     * Parameters:
     * lon - {Float}
     * lat - {Float}
     * 
     * Returns:
     * {Object} MapObject LonLat built from lon and lat params
     */
    getMapObjectLonLatFromLonLat: function(lon, lat) {
        var point;
        if(this.sphericalMercator) {
            var lonlat = this.inverseMercator(lon, lat);
            point = new BMap.Point(lonlat.lon,lonlat.lat);
        } else {
            point = new BMap.Point(lon,lat);
        }
        return point;
    },
    
  // Pixel
    
    /**
     * APIMethod: getMapObjectPixelFromXY
     * 
     * Parameters:
     * x - {Integer}
     * y - {Integer}
     * 
     * Returns:
     * {Object} MapObject Pixel from x and y parameters
     */
    getMapObjectPixelFromXY: function(x, y) {
        return new BMap.Pixel(x, y);
    },
        
    /**
     * APIMethod: destroy
     * Clean up this layer.
     */
    destroy: function() {
        if (this.repositionListener) {
            google.maps.event.removeListener(this.repositionListener);
        }
        if (this.repositionTimer) {
            window.clearTimeout(this.repositionTimer);
        }
        OpenLayers.Layer.Baidu.prototype.destroy.apply(this, arguments);
    }
    
};
