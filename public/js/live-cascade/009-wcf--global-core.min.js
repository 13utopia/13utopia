( function( $ ) {
  /**
   * @param $scope The Widget wrapper element as a jQuery element
   * @param $ The jQuery alias
   */
  var Wcf_Accordion = function ($scope, $) {      
 
      var $wrapper = $scope.find('.elementor-accordion');
      var $items   = $wrapper.find('.elementor-accordion-item');
      
      if($items.length && $wrapper.attr('data-active') === 'yes'){
         $items.find('[data-active="yes"]').addClass('elementor-active');
         $items.find('.elementor-tab-content[data-active="yes"]').addClass('elementor-active').slideToggle();               
      }
      
      $scope.find('.elementor-tab-title').on('click',function(){       
          $(this).toggleClass("elementor-active").next(".elementor-tab-content").slideToggle().parent().siblings().find(".elementor-tab-content").slideUp().prev().removeClass("elementor-active");            
      });
     
  };
  var Wcf_Accordion_2 = function ($scope, $) {      
 
      var $wrapper = $scope.find('.elementor-accordion');
      var $items   = $wrapper.find('.elementor-accordion-item');
      
      if($items.length && $wrapper.attr('data-active') === 'yes'){
         $items.find('[data-active="yes"]').addClass('elementor-active');
         $items.find('.elementor-tab-content[data-active="yes"]').addClass('elementor-active').slideToggle();               
      }
      
      $scope.find('.elementor-tab-title').on('click',function(){       
          $(this).toggleClass("elementor-active").next(".elementor-tab-content").slideToggle().parent().siblings().find(".elementor-tab-content").slideUp().prev().removeClass("elementor-active");            
      });
     
  };
 
  // Make sure you run this code under Elementor.
  $( window ).on( 'elementor/frontend/init', function() {

      const icon_box  =  elementorModules.frontend.handlers.Base.extend({
          bindEvents : function bindEvents() {
          this.run();            
          },
          
          run : function(){
    
          if(this.getElementSettings('wcf_enable_bottom_top_scroll') === 'yes'){   
              
              if(this.findElement('a').length){
              
                  let target = this.findElement('a').attr('href');                      
                  if ( !target ){                        
                      this.findElement('a').on('click', function(e){
                          e.preventDefault();
                          if (typeof(gsap) === "object") {
                              gsap.to(window, {duration: 1, scrollTo:{y:'body', offsetY:70}});
                          }
                      });
                  }else{
                  
                      try{
                          if (typeof(gsap) === "object") {
                          let element = document.querySelector(this.findElement('a').attr('href'));
                          let linkST = ScrollTrigger.create({
                            trigger: element,
                            start: "top top",
                          });
                          
                          ScrollTrigger.create({
                            trigger: element,
                            start: "top center",
                            end: "bottom center"                          
                          });
                          
                          this.findElement('a').on('click', function(e){
                              e.preventDefault();   
                              gsap.to(window, {
                                  duration: 0.1,
                                  scrollTo: linkST.start,
                                  overwrite: "auto"
                              });                           
                          });
                      }
                          
                      }catch (e) {}
                  }                                       
                  
              }else{
                  
                 this.findElement('.elementor-widget-container').css({'cursor':'pointer'});
                 this.findElement('.elementor-widget-container').on('click' , function(e){
                      e.preventDefault();  
                      if (typeof(gsap) === "object") {
                          gsap.to(window, {duration: 1, scrollTo:{y:'body', offsetY:70}});
                      }
                 }); 
              }
          } 
         
          }
      
      })
  
      elementorFrontend.hooks.addAction( 'frontend/element_ready/accordion.skin-wcf-accordion', Wcf_Accordion );
      elementorFrontend.hooks.addAction( 'frontend/element_ready/accordion.skin-wcf-accordion-two', Wcf_Accordion_2 );
      
      const addIcon_BoxHandler = ( $element ) => {
          elementorFrontend.elementsHandler.addHandler( icon_box, {
              $element,
          } );
      };
       
      elementorFrontend.hooks.addAction( 'frontend/element_ready/icon-box.default', addIcon_BoxHandler );
      elementorFrontend.hooks.addAction( 'frontend/element_ready/wcf--button.default', addIcon_BoxHandler );
      elementorFrontend.hooks.addAction( 'frontend/element_ready/button.default', addIcon_BoxHandler );
  } );
} )( jQuery );

// Sticky Section
(function ($) {

    // sticky
    
    var Wcf_Sticky_Menu = {

        elementorSection: function( $scope ) {
            var $_target   = $scope,
                instance  = null,
                editMode  = Boolean( elementorFrontend.isEditMode() );
                instance = new Wcf_Sticky_Menu_Plugin( $_target );
                // run main functionality                
                instance.init(instance);
              
        },
    };

    Wcf_Sticky_Menu_Plugin = function( $target ) {

        var self         = this,
        sectionId        = $target.data('id'),
        settings         = false,
        editMode         = Boolean( elementorFrontend.isEditMode() ),
        $window          = $( window ),
        $body            = $( 'body' );
       
        /**
         * Init
         */
        self.init = function() {
            
            self.wcf_infos_sticky( sectionId );         
            return false;
        };

        
        self.wcf_infos_sticky = function (sectionId){
          
            var wcf_global_sticky = false;
            var wcf_sticky_offset = 150;
            var wcf_sticky_type   = null;

            wcf_global_sticky = self.getSettings( sectionId, 'wcf_global_sticky' );
            wcf_sticky_type   = self.getSettings( sectionId, 'wcf_sticky_type' );
            wcf_sticky_offset = parseInt(self.getSettings( sectionId, 'wcf_sticky_offset' ));
            
            if(isNaN( wcf_sticky_offset)){
                wcf_sticky_offset = 150;  
            }
            //default offset
            if(wcf_sticky_offset < 5 ){
                 wcf_sticky_offset = 110;  
            }
          
            if(wcf_global_sticky == 'yes'){

                $target.addClass('wcf-sticky-container');

                if(wcf_sticky_type == 'top'){
                    $target.addClass('top');
                    $target.removeClass('bottom');
                }

                if(wcf_sticky_type == 'bottom'){
                    $target.addClass('bottom');
                    $target.removeClass('top');
                }
                if(wcf_sticky_type == ''){
                    $target.removeClass('top');
                    $target.removeClass('bottom');
                }   
                  
                $window.on('scroll', function (event) {                   
                    var scroll = $window.scrollTop();                    
                    if (scroll < wcf_sticky_offset) {
                        $target.removeClass("wcf-is-sticky");
                    } else {
                        $target.addClass("wcf-is-sticky");
                    }
                });
            }else{

                $target.removeClass('wcf-sticky-container');                
            }


        };

        self.getSettings = function(sectionId, key){
            var editorElements      = null,
            sectionData             = {};
             

            if ( ! editMode ) {
                sectionId = 'section' + sectionId;

                if(!window.wcf_section_sticky_data || ! window.wcf_section_sticky_data.hasOwnProperty( sectionId )){
                    return false;
                }

                if(! window.wcf_section_sticky_data[ sectionId ].hasOwnProperty( key )){
                    return false;
                }

                return window.wcf_section_sticky_data[ sectionId ][key];
            }else{
                 
                if ( ! window.elementor.hasOwnProperty( 'elements' ) ) {
                    return false;
                }
                editorElements = window.elementor.elements;
                
                if ( ! editorElements.models ) {
                    return false;
                }
                $.each( editorElements.models, function( index, obj ) {
                    if ( sectionId == obj.id ) {
                        sectionData = obj.attributes.settings.attributes;
                    }
                });

                if ( ! sectionData.hasOwnProperty( key ) ) {
                    return false;
                }
            }

            return sectionData[ key ];
        };
    }
    
    $(window).on('elementor/frontend/init', function () {
      
        elementorFrontend.hooks.addAction( 'frontend/element_ready/section', Wcf_Sticky_Menu.elementorSection );
        elementorFrontend.hooks.addAction( 'frontend/element_ready/container', Wcf_Sticky_Menu.elementorSection );        
      
    });    
 

})(jQuery);
