function routerConfig(
  $stateProvider,
  $urlRouterProvider,
  $locationProvider,
  themeManagerProvider
) {
  'ngInject';
  console.info(
    '[TEME]: ' + themeManagerProvider.theme,
    '[VARIANT]: ' + themeManagerProvider.variant
  );

  $locationProvider.html5Mode(true);
  $stateProvider
    .state('volumio', {
      url: '/',
      abstract: true,
      views: {
        layout: {
          templateUrl: themeManagerProvider.getHtmlPath('layout'),
          controller: 'LayoutController',
          controllerAs: 'layout'
        },
        'header@volumio': {
          templateUrl: themeManagerProvider.getHtmlPath('header'),
          controller: 'HeaderController',
          controllerAs: 'header'
        },
        'footer@volumio': {
          templateUrl: themeManagerProvider.getHtmlPath('footer'),
          controller: 'FooterController',
          controllerAs: 'footer'
        }
      },
      resolve: {
        dependenciesResolver: (
          $rootScope,
          ripperService,
          modalListenerService,
          toastMessageService,
          uiSettingsService,
          updaterService
        ) => {
          //NOTE this resolver init global services like toast
        },
        socketResolver: function($rootScope, deviceEndpointsService, $q, $document) {
          var checking = $q.defer();
          deviceEndpointsService.initSocket().then(isAvalaible => {
            if (isAvalaible === false) {
              checking.reject('NO_SOCKET_ENDPOINTS'); //this is catched by index.run.js
              return;
            }
            $document[0].body.classList.remove('myVolumioBkg');
            checking.resolve(isAvalaible);
          });
          return checking.promise;
        }
      }
    })

  .state('volumio.browse', {
    url: 'browse',
    views: {
      'content@volumio': {
        templateUrl: themeManagerProvider.getHtmlPath('browse'),
        controller: 'BrowseController',
        controllerAs: 'browse'
      }
    }
  })

  .state('volumio.play-queue', {
    url: 'queue',
    views: {
      'content@volumio': {
        templateUrl: themeManagerProvider.getHtmlPath('play-queue'),
        controller: 'PlayQueueController',
        controllerAs: 'playQueue'
      }
    }
  })

  .state('volumio.playback', {
    url: 'playback',
    views: {
      'content@volumio': {
        templateUrl: themeManagerProvider.getHtmlPath('playback'),
        controller: 'PlaybackController',
        controllerAs: 'playback'
      }
    }
  })

  .state('volumio.debug', {
    url: 'debug',
    views: {
      'content@volumio': {
        templateUrl: 'app/components/debug/volumio-debug.html',
        controller: 'DebugController',
        controllerAs: 'debug'
      }
    }
  })

  .state('volumio.multi-room', {
    url: 'multi-room',
    views: {
      'content@volumio': {
        templateUrl: 'app/themes/axiom/multi-room-manager/axiom-multi-room-manager.html',
        controller: 'MultiRoomManagerController',
        controllerAs: 'multiRoomManager'
      }
    }
  })

  .state('volumio.plugin', {
    url: 'plugin/:pluginName',
    params: { isPluginSettings: null },
    views: {
      'content@volumio': {
        templateUrl: 'app/plugin/plugin.html',
        controller: 'PluginController',
        controllerAs: 'plugin'
      }
    }
  })

  .state('volumio.plugin-manager', {
    url: 'plugin-manager',
    views: {
      'content@volumio': {
        templateUrl: 'app/plugin-manager/plugin-manager.html',
        controller: 'PluginManagerController',
        controllerAs: 'pluginManager'
      }
    }
  })

  /* --------- MYVOLUMIO ----------- */

  .state('myvolumio', {
    url: '/myvolumio',
    abstract: true,
    views: {
      layout: {
        templateUrl: themeManagerProvider.getHtmlPath('layout'),
        controller: 'LayoutController',
        controllerAs: 'layout'
      },
      'header@myvolumio': {
        templateUrl: themeManagerProvider.getHtmlPath('header'),
        controller: 'HeaderController',
        controllerAs: 'header'
      },
      'footer@myvolumio': {
        templateUrl: themeManagerProvider.getHtmlPath('footer'),
        controller: 'FooterController',
        controllerAs: 'footer'
      }
    },
    resolve: {
      dependenciesResolver: (
        $rootScope,
        modalListenerService,
        toastMessageService,
        uiSettingsService
      ) => {
        //NOTE this resolver init global services like toast
        return true;
      },
      socketResolver: function(
        $rootScope,
        deviceEndpointsService,
        $q,
        uiSettingsService,
        $document
      ) {
        var initing = $q.defer();
        $document[0].body.classList.add('myVolumioBkg');
        deviceEndpointsService
          .initSocket()
          .then(isAvalaible => {
            if (!isAvalaible) {
              uiSettingsService.setLanguage();
            }
            initing.resolve(true);
          })
          .catch(error => {
            uiSettingsService.setLanguage();
            initing.resolve(true);
          });
        return initing.promise;
      },
      authEnabled: function(authService, $q) {
        let enabling = $q.defer();
        authService.isAuthEnabled().then(enabled => {
          if (!enabled) {
            enabling.reject('MYVOLUMIO_NOT_ENABLED');
          }
          enabling.resolve(true);
        });
        return enabling.promise;
      }
    }
  })

  .state('myvolumio.login', {
    url: '/login',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/components/myvolumio/login/myvolumio-login.html',
        controller: 'MyVolumioLoginController',
        controllerAs: 'MyVolumioLoginController',
        resolve: {
          user: [
            'authService',
            function(authService) {
              return authService.requireNullUserOrRedirect();
            }
          ]
        }
      }
    }
  })

  .state('myvolumio.signup', {
    url: '/signup',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/components/myvolumio/signup/myvolumio-signup.html',
        controller: 'MyVolumioSignupController',
        controllerAs: 'myVolumioSignupController',
        resolve: {
          user: [
            'authService',
            function(authService) {
              return authService.requireNullUserOrRedirect();
            }
          ]
        }
      }
    }
  })

  .state('myvolumio.profile', {
    url: '/profile',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/components/myvolumio/profile/myvolumio-profile.html',
        controller: 'MyVolumioProfileController',
        controllerAs: 'myVolumioProfileController',
        resolve: {
          user: [
            'authService',
            function(authService) {
              return authService.requireVerifiedUserOrRedirect();
            }
          ]
        }
      }
    }
  })

  .state('myvolumio.edit-profile', {
    url: 'profile/edit',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/components/myvolumio/edit-profile/myvolumio-edit-profile.html',
        controller: 'MyVolumioEditProfileController',
        controllerAs: 'myVolumioEditProfileController',
        resolve: {
          user: [
            'authService',
            function(authService) {
              return authService.requireUser();
            }
          ]
        }
      }
    }
  })

  .state('myvolumio.plans', {
    url: '/plans',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/components/myvolumio/plans/myvolumio-plans.html',
        controller: 'MyVolumioPlansController',
        controllerAs: 'myVolumioPlansController',
        resolve: {
          user: [
            'authService',
            function(authService) {
              return authService.requireVerifiedUserOrRedirect();
            }
          ]
        }
      }
    }
  })

  .state('myvolumio.subscribe', {
    url: '/subscribe/:plan',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/components/myvolumio/subscribe/myvolumio-subscribe.html',
        controller: 'MyVolumioSubscribeController',
        controllerAs: 'myVolumioSubscribeController',
        resolve: {
          user: [
            'authService',
            function(authService) {
              return authService.requireVerifiedUserOrRedirect();
            }
          ]
        }
      }
    }
  })

  .state('myvolumio.payment-success', {
    url: '/payment/success',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/components/myvolumio/payment-success/myvolumio-payment-success.html',
        controller: 'MyVolumioPaymentSuccessController',
        controllerAs: 'myVolumioPaymentSuccessController',
        resolve: {
          user: [
            'authService',
            function(authService) {
              return authService.requireVerifiedUserOrRedirect();
            }
          ]
        }
      }
    }
  })

  .state('myvolumio.payment-fail', {
    url: '/payment/fail',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/components/myvolumio/payment-fail/myvolumio-payment-fail.html',
        controller: 'MyVolumioPaymentFailController',
        controllerAs: 'myVolumioPaymentFailController',
        resolve: {
          user: [
            'authService',
            function(authService) {
              return authService.requireVerifiedUserOrRedirect();
            }
          ]
        }
      }
    }
  })

  .state('myvolumio.recover-password', {
    url: '/recover-password',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/components/myvolumio/recover-password/myvolumio-recover-password.html',
        controller: 'MyVolumioRecoverPasswordController',
        controllerAs: 'myVolumioRecoverPasswordController',
        resolve: {
          user: [
            'authService',
            function(authService) {
              return authService.waitForUser();
            }
          ]
        }
      }
    }
  })

  .state('myvolumio.verify-user', {
    url: '/profile/verify',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/components/myvolumio/verify-user/myvolumio-verify-user.html',
        controller: 'MyVolumioVerifyUserController',
        controllerAs: 'myVolumioVerifyUserController',
        resolve: {
          user: [
            'authService',
            function(authService) {
              return authService.requireUser();
            }
          ]
        }
      }
    }
  })

  .state('myvolumio.cancel-subscription', {
    url: '/subscribe/cancel',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/components/myvolumio/cancel-subscription/myvolumio-cancel-subscription.html',
        controller: 'MyVolumioCancelSubscriptionController',
        controllerAs: 'myVolumioCancelSubscriptionController',
        resolve: {
          user: [
            'authService',
            function(authService) {
              return authService.requireVerifiedUserOrRedirect();
            }
          ]
        }
      }
    }
  })

  .state('myvolumio.change-subscription', {
    url: '/subscribe/change/:plan',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/components/myvolumio/change-subscription/myvolumio-change-subscription.html',
        controller: 'MyVolumioChangeSubscriptionController',
        controllerAs: 'myVolumioChangeSubscriptionController',
        resolve: {
          user: [
            'authService',
            function(authService) {
              return authService.requireVerifiedUserOrRedirect();
            }
          ]
        }
      }
    }
  })

  /* --------- END MYVOLUMIO ----------- */

  .state('volumio.static-page', {
    url: 'static-page/:pageName',
    views: {
      'content@volumio': {
        templateUrl: 'app/static-pages/static-page.html',
        controller: 'StaticPageController',
        controllerAs: 'staticPage'
      }
    }
  })

  .state('redirect', {
    url: '/redirect',
    views: {
      layout: {
        template: '',
        controller: function($state, uiSettingsService, cloudService) {
          if (cloudService.isOnCloud === true) {
            $state.go('myvolumio.login');
            return;
          }
          uiSettingsService.initService().then(data => {
            if (data && data.indexState) {
              $state.go(`volumio.${data.indexState}`);
            } else {
              $state.go('volumio.playback');
            }
          });
        }
      }
    }
  })

  .state('volumio.wizard', {
    url: 'wizard',
    views: {
      'content@volumio': {
        templateUrl: 'app/wizard/wizard.html',
        controller: 'WizardController',
        controllerAs: 'wizard'
      }
    }
  });

  $urlRouterProvider.otherwise('/redirect');
}

export default routerConfig;