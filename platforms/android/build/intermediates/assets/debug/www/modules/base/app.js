var Config = {
    server:'http://localhost:8080/lxtServer',
    debug:true,
    key:'ed26d4cd99aa11e5b8a4c89cdc776729',
    random:(''+Math.random()).substr(2)
};
var app = angular.module('app',['ionic', 'oc.lazyLoad', 'app.route', 'ngCordova','utils']);
angular.module('app.route',[]).config(['$urlRouterProvider','$ocLazyLoadProvider','$httpProvider',function($urlRouterProvider,$ocLazyLoadProvider,$httpProvider){
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $urlRouterProvider.otherwise('/home');
    $ocLazyLoadProvider.config({
        modules:[{
            name:'mobiscroll',
            files:[
                'bower_components/mobiscroll/css/mobiscroll.custom-3.0.0-beta6.min.css',
                'bower_components/mobiscroll/js/mobiscroll.custom-3.0.0-beta6.min.js'
            ]
        },{
            name:'rating',
            files:[
                'bower_components/ionic-rating/ionic-rating.css',
                'bower_components/ionic-rating/ionic-rating.min.js'
            ]
        },{
            name:'mfb-menu',
            files:[
                'bower_components/ng-material-floating-button/mfb/dist/mfb.min.css',
                'bower_components/ng-material-floating-button/src/mfb-directive.js'
            ]
        },{
            name:'echarts',
            files:[
                'bower_components/echarts/build/dist/echarts-all.js',
                'modules/base/directives/echarts.js'
            ]
        },{
            name:'patternLock',
            files:[
                'bower_components/patternLock/patternLock.css',
                'bower_components/patternLock/patternLock.min.js',
                'modules/base/directives/patternLock.js'
            ]
        },{
            name:'animate',
            files:[
                'styles/animate.min.css'
            ]
        }]
    });
}]);

app.config(['$ionicConfigProvider',function($ionicConfigProvider){
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.views.swipeBackEnabled(false);
    $ionicConfigProvider.views.maxCache(5);
    $ionicConfigProvider.views.forwardCache(true);
    $ionicConfigProvider.form.checkbox('circle');
    $ionicConfigProvider.form.toggle('small');
    $ionicConfigProvider.spinner.icon('bubbles');
}]).run(['$rootScope','$ionicPlatform','$state','utils',function ($rootScope, $ionicPlatform,$state,utils) {
    utils.$ionicPlatform.ready(function(){
        if(screen.lockOrientation){
            screen.lockOrientation('portrait');//landscape
        }

        $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
            $rootScope.toast = '已连接至'+navigator.connection.type+'网络';
        });

        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            $rootScope.toast = '未检测到网络';
        });

        var exitState = ['home','login'];

        utils.$ionicPlatform.registerBackButtonAction(function(e){
            if (exitState.indexOf($state.current.name)!=-1 && !$rootScope.settingLock){
                if ($rootScope.backButtonPressedOnceToExit){
                    ionic.Platform.exitApp();
                } else {
                    $rootScope.backButtonPressedOnceToExit = true;
                    $rootScope.toast = '再按一次退出系统';
                    utils.$timeout(function () {
                        $rootScope.backButtonPressedOnceToExit = false;  
                    }, 2000);
                }
            }else if(utils.$ionicHistory.backView()){
                utils.$ionicHistory.goBack();
            }
        }, 100);

        var getRegistrationID = function() {
            window.plugins.jPushPlugin.getRegistrationID(onGetRegistrationID);
        };

        var onGetRegistrationID = function(data) {
            try {
                console.log("JPushPlugin:registrationID is " + data);

                if (data.length == 0) {
                    var t1 = window.setTimeout(getRegistrationID, 1000);
                }
                $("#registrationId").html(data);
            } catch (exception) {
                console.log(exception);
            }
        };

        var onOpenNotification = function(event) {
            try {
                var alertContent;
                if (device.platform == "Android") {
                    alertContent = event.alert;
                } else {
                    alertContent = event.aps.alert;
                }
                console.log(event);
                if(event.extras.state){
                    utils.$state.go(event.extras.state);
                }
            } catch (exception) {
                console.log("JPushPlugin:onOpenNotification" + exception);
            }
        };

        var initiateUI = function() {
            try {
                window.plugins.jPushPlugin.init();
                window.setTimeout(getRegistrationID, 1000);
                if (device.platform != "Android") {
                    window.plugins.jPushPlugin.setDebugModeFromIos();
                    window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
                } else {
                    window.plugins.jPushPlugin.setDebugMode(true);
                    window.plugins.jPushPlugin.setStatisticsOpen(true);
                }
            } catch (exception) {
                console.log(exception);
            }
        };

        // document.addEventListener("jpush.openNotification", onOpenNotification, false);
        // window.plugins.jPushPlugin.setAlias('chenjia');
        // initiateUI();
        
    });
}]).controller('rootController',['$rootScope','$scope','utils',function($rootScope,$scope,utils){
    $rootScope.vo = {
        ready:true
    };
    $rootScope.toggleMenu = function(menu) {
        if ($rootScope.isMenuShown(menu)) {
            $rootScope.shownMenu = null;
        } else {
            $rootScope.shownMenu = menu;
        }
    };
    $rootScope.isMenuShown = function(menu) {
        return $rootScope.shownMenu === menu;
    };
    $rootScope.menus=[{
        name:'菜单1',
        menus:[{
            name:'首页',
            state:'home',
            icon:'fa fa-home fa-fw'
        },{
            name:'通讯录',
            state:'contacts',
            icon:'fa fa-book fa-fw'
        },{
            name:'动态列表',
            state:'list',
            icon:'fa fa-bars fa-fw'
        },{
            name:'动态图表',
            state:'chart',
            icon:'fa fa-bar-chart fa-fw'
        },{
            name:'表单',
            state:'form',
            icon:'fa fa-list-alt fa-fw'
        },{
            name:'选项卡',
            state:'tab',
            icon:'fa fa-folder-o fa-fw'
        },{
            name:'登录',
            state:'login',
            icon:'fa fa-lock fa-fw'
        },{
            name:'加载图标',
            state:'loading',
            icon:'fa fa-spinner fa-pulse fa-fw'
        }]
    },{
        name:'菜单2',
        menus:[{
            name:'首页',
            state:'home',
            icon:'fa fa-home fa-fw'
        },{
            name:'通讯录',
            state:'contacts',
            icon:'fa fa-book fa-fw'
        },{
            name:'动态列表',
            state:'list',
            icon:'fa fa-bars fa-fw'
        },{
            name:'动态图表',
            state:'chart',
            icon:'fa fa-bar-chart fa-fw'
        },{
            name:'表单',
            state:'form',
            icon:'fa fa-list-alt fa-fw'
        },{
            name:'选项卡',
            state:'tab',
            icon:'fa fa-folder-o fa-fw'
        },{
            name:'登录',
            state:'login',
            icon:'fa fa-lock fa-fw'
        },{
            name:'加载图标',
            state:'loading',
            icon:'fa fa-spinner fa-pulse fa-fw'
        }]
    }];

    $rootScope.server = Config.server;

    utils.$timeout(function(){
        $rootScope.screenWidth = window.screen.availWidth;
        $rootScope.screenHeight = window.screen.availHeight;
        utils.$ionicSideMenuDelegate.$getByHandle('menuHandle').canDragContent(false);
    });
    
    $rootScope.go = function(state,params){
        if(state==-1){
            utils.$ionicHistory.goBack();
        }else if(typeof state == 'string' && state.substr(0,1)=='#'){
            utils.$location.path(state.substr(1));
        }else{
            utils.$state.go(state,params);
        }
    };

    $rootScope.logout = function(){
        utils.cache.put('session','');
        utils.$state.go('login');
    };

    var safeState = [
        'home','login','demo'
    ];

    $rootScope.$on('$stateChangeSuccess',function(event, toState,toParams, fromState,fromParams) {
        $rootScope.state = toState;
        if(utils.$ionicSideMenuDelegate.isOpenLeft()){
            utils.$ionicSideMenuDelegate.toggleLeft(false);
        }
    });

    $rootScope.showPatternLock = function(flag){
        $rootScope.patternLockFlag = flag;
        utils.$ionicModal.fromTemplateUrl('modules/sample/views/patternLock.html',{
            scope: $rootScope,
            animation:'slide-in-up'
        }).then(function(modal){
            modal.show();
            $rootScope.modalHeight = $('.modal').height();
            $rootScope.hidePatternLock = function(){
                modal.hide();
            };
            $rootScope.patternLockModal = modal;
        });
    };

    $scope.ready = (function(){
        utils.$ocLazyLoad.load([
            'mobiscroll',
            'rating',
            'mfb-menu',
            'echarts',
            'patternLock',
            'animate'
            // 'modules/base/directives/input-datetime.js',
            // 'modules/base/directives/input-select.js',
            // 'modules/base/directives/input-treelist.js',
            // 'modules/base/directives/input-color.js',
            // 'modules/base/directives/toast.js',
            // 'modules/sample/controllers/formController.js'
        ]);
        // utils.$templateRequest('modules/sample/views/form.html');
        utils.$timeout(function(){
            $rootScope.init = 1;
        },500);
        utils.$timeout(function(){
            $rootScope.init = 2;
        },1000);
    })();
}]);