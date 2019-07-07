#import <Foundation/Foundation.h>
@import UserNotifications;
#import "RNNotificationsStore.h"

@interface RNNotificationEventHandler : NSObject

- (instancetype)initWithStore:(RNNotificationsStore *)store;

- (void)didReceiveForegroundPayload:(NSDictionary *)payload;
- (void)didOpenNotificationPayload:(NSDictionary *)payload;
- (void)handleActionWithIdentifier:(NSString *)identifier forPayload:(NSDictionary *)payload withResponse:(NSString *)response completionHandler:(void (^)())completionHandler;

@end
