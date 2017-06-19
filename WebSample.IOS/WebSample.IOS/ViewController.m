//
//  ViewController.m
//  WebSample.IOS
//
//  Created by bijinlong on 29/03/2017.
//  Copyright © 2017 bijinlong. All rights reserved.
//

#import "ViewController.h"

@interface ViewController ()<UIWebViewDelegate>

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];

    CGRect webframe = CGRectMake(self.view.frame.origin.x, self.view.frame.origin.y+100, self.view.frame.size.width, self.view.frame.size.height-100);
    UIWebView * view = [[UIWebView alloc]initWithFrame:webframe];

    [view loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@"https://221.176.36.17:8443/test"]]];
    [self.view addSubview:view];
    view.delegate = self;
  
    // Do any additional setup after loading the view, typically from a nib.
}


- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType{
    NSString * scheme = request.URL.scheme;
    NSURL  *url = request.URL;
    if([scheme isEqualToString:@"http"] || [scheme isEqualToString:@"https"])
    {
        return YES;
    }
    
    float iosversion =[[[UIDevice currentDevice]systemVersion]floatValue];
    if(iosversion > 10.0)
    {
            
          //if([[UIApplication sharedApplication] canOpenURL:url]){
       
        [[UIApplication sharedApplication] openURL:url options:@{UIApplicationOpenURLOptionsOpenInPlaceKey:@"0"} completionHandler:^(BOOL success) {
                // 回调
    if (!success) {}}];
    }else{
        [[UIApplication sharedApplication] openURL:url];
    }
    return NO;
    
}

@end
