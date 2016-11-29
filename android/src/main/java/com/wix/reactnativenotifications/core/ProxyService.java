package com.wix.reactnativenotifications.core;

import android.app.IntentService;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.wix.reactnativenotifications.core.notification.IPushNotification;
import com.wix.reactnativenotifications.core.notification.PushNotification;
import com.wix.reactnativenotifications.core.notificationdrawer.IPushNotificationsDrawer;
import com.wix.reactnativenotifications.core.notificationdrawer.PushNotificationsDrawer;

public class ProxyService extends IntentService {

    private static final String TAG = ProxyService.class.getSimpleName();

    public ProxyService() {
        super("notificationsProxyService");
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        Log.d(TAG, "New intent: "+intent);
        final Bundle notificationData = NotificationIntentAdapter.extractPendingNotificationDataFromIntent(intent);
        final IPushNotification pushNotification = PushNotification.get(this, notificationData, ReactAppLifecycleFacade.get());
        if (pushNotification != null) {
            pushNotification.onOpened();
        }

        final IPushNotificationsDrawer pushNotificationDrawer = PushNotificationsDrawer.get(this);
        pushNotificationDrawer.onNotificationOpened();
    }
}
