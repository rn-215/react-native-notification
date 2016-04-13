/**
 * @providesModule RNNotifications
 * @flow
 */
"use strict";
import { NativeModules, DeviceEventEmitter } from "react-native";
import Map from "core-js/library/es6/map";
const NativeRNNotifications = NativeModules.RNNotifications; // eslint-disable-line no-unused-vars
import IOSNotification from "./notification.ios";

export const DEVICE_NOTIFICATION_RECEIVED_FOREGROUND_EVENT = "notificationReceivedForeground";
export const DEVICE_NOTIFICATION_RECEIVED_BACKGROUND_EVENT = "notificationReceivedBackground";
export const DEVICE_NOTIFICATION_OPENED_EVENT = "notificationOpened";
export const DEVICE_NOTIFICATION_ACTION_RECEIVED = "notificationActionReceived";

let _notificationHandlers = new Map();

export class NotificationAction {
  constructor(options: Object, handler: Function) {
    this.options = options;
    this.handler = handler;
  }
}

export class NotificationCategory {
  constructor(options: Object) {
    this.options = options;
  }
}

export default class NotificationsIOS {
  /**
   * Attaches a listener to remote notification events while the app is running
   * in the foreground or the background.
   *
   * Valid events are:
   *
   * - `notificationReceivedForeground` : Fired when a notification (local / remote) is received when app is on foreground state.
   * - `notificationReceivedBackground`: Fired when a background notification is received.
   * - `notificationOpened`: Fired when a notification (local / remote) is opened.
   */
  static addEventListener(type: string, handler: Function) {
    if (type === DEVICE_NOTIFICATION_RECEIVED_FOREGROUND_EVENT ||
        type === DEVICE_NOTIFICATION_RECEIVED_BACKGROUND_EVENT ||
        type === DEVICE_NOTIFICATION_OPENED_EVENT) {
      let listener = DeviceEventEmitter.addListener(
        type,
        notification => handler(new IOSNotification(notification))
      );

      _notificationHandlers.set(handler, listener);
    }
  }

  /**
   * Removes the event listener. Do this in `componentWillUnmount` to prevent
   * memory leaks
   */
  static removeEventListener(type: string, handler: Function) {
    if (type === DEVICE_NOTIFICATION_RECEIVED_FOREGROUND_EVENT ||
        type === DEVICE_NOTIFICATION_RECEIVED_BACKGROUND_EVENT ||
        type === DEVICE_NOTIFICATION_OPENED_EVENT) {
      let listener = _notificationHandlers.get(handler);
      if (!listener) {
        return;
      }

      listener.remove();
      _notificationHandlers.delete(handler);
    }
  }

  static _actionHandlerGenerator(identifier: string, handler: Function) {
    return (action) => {
      if (action.identifier === identifier) {
        handler(action);
      }
    };
  }

  /**
   * Sets the notification categories
   */
   /* eslint-disable no-unused-vars */
  static setCategories(categories: Array<NotificationCategory>) {
    let notificationCategories = [];

    if (categories) {
      notificationCategories = categories.map(category => {
        return Object.assign({}, category.options, {
          actions: category.options.actions.map(action => {
            // subscribe to action event
            DeviceEventEmitter.addListener(DEVICE_NOTIFICATION_ACTION_RECEIVED, this._actionHandlerGenerator(action.options.identifier, action.handler));

            return action.options;
          })
        });
      });
    }

    NativeRNNotifications.updateNotificationCategories(notificationCategories);
  }
}
