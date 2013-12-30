package com.kounaer.test.proxy;

import java.lang.reflect.Method;

import net.sf.cglib.proxy.Enhancer;
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;

//导包：cglib-nodep-2.2.3.jar
public class PersonProxyCglib implements MethodInterceptor {
	private Object targetObj;

	/**
	 * 生成的代理对象其实就是目标对象的子类
	 * 
	 * @param obj
	 *            被代理对象
	 * @return 代理对象的实例
	 */
	public Object createProxyInstance(Object obj) {
		this.targetObj = obj;
		Enhancer enhancer = new Enhancer();// 用于生成代理对象
		enhancer.setSuperclass(this.targetObj.getClass());// 设置代理对象的父类
		enhancer.setCallback(this);// 设置代理对象的回调函数就是本生
		return enhancer.create();// 生成代理对象
	}

	/*
	 * 当代理对象的方法被调运时，就会执行改代理对象的回调函数，也就是intercept方法 这个回调函数接收代理对象传递来的参数
	 */
	@Override
	public Object intercept(Object obj, Method method, Object[] args,
			MethodProxy proxy) throws Throwable {
		Object result = null;
		System.out.print("我是#");
		result = proxy.invokeSuper(obj, args);
		System.out.print("#人");
		return result;
	}

}
