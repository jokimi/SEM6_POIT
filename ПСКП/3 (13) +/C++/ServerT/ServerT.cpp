#define _WINSOCK_DEPRECATED_NO_WARNINGS
#define _CRT_SECURE_NO_WARNINGS
#include <iostream>
#include <string>
#include <tchar.h>
#include <ctime>
#include "Winsock2.h"
#pragma comment(lib, "WS2_32.lib")
using namespace std;

string GetErrorMsgText(int code) {
	string msgText;
	switch (code) {
		case WSAEINTR: msgText = "WSAEINTR"; break;
		case WSAEACCES: msgText = "WSAEACCES"; break;
		case WSAEFAULT: msgText = "WSAEFAULT"; break;
		case WSAEINVAL: msgText = "WSAEINVAL"; break;
		case WSAEMFILE: msgText = "WSAEMFILE"; break;
		case WSAEWOULDBLOCK: msgText = "WSAEWOULDBLOCK"; break;
		case WSAEINPROGRESS: msgText = "WSAEINPROGRESS"; break;
		case WSAEALREADY: msgText = "WSAEALREADY"; break;
		case WSAENOTSOCK: msgText = "WSAENOTSOCK"; break;
		case WSAEDESTADDRREQ: msgText = "WSAEDESTADDRREQ"; break;
		case WSAEMSGSIZE: msgText = "WSAEMSGSIZE"; break;
		case WSAEPROTOTYPE: msgText = "WSAEPROTOTYPE"; break;
		case WSAENOPROTOOPT: msgText = "WSAENOPROTOOPT"; break;
		case WSAEPROTONOSUPPORT: msgText = "WSAEPROTONOSUPPORT"; break;
		case WSAESOCKTNOSUPPORT: msgText = "WSAESOCKTNOSUPPORT"; break;
		case WSAEOPNOTSUPP: msgText = "WSAEOPNOTSUPP"; break;
		case WSAEPFNOSUPPORT: msgText = "WSAEPFNOSUPPORT"; break;
		case WSAEAFNOSUPPORT: msgText = "WSAEAFNOSUPPORT"; break;
		case WSAEADDRINUSE: msgText = "WSAEADDRINUSE"; break;
		case WSAEADDRNOTAVAIL: msgText = "WSAEADDRNOTAVAIL"; break;
		case WSAENETDOWN: msgText = "WSAENETDOWN"; break;
		case WSAENETUNREACH: msgText = "WSAENETUNREACH"; break;
		case WSAENETRESET: msgText = "WSAENETRESET"; break;
		case WSAECONNABORTED: msgText = "WSAECONNABORTED"; break;
		case WSAECONNRESET: msgText = "WSAECONNRESET"; break;
		case WSAENOBUFS: msgText = "WSAENOBUFS"; break;
		case WSAEISCONN: msgText = "WSAEISCONN"; break;
		case WSAENOTCONN: msgText = "WSAENOTCONN"; break;
		case WSAESHUTDOWN: msgText = "WSAESHUTDOWN"; break;
		case WSAETIMEDOUT: msgText = "WSAETIMEDOUT"; break;
		case WSAECONNREFUSED: msgText = "WSAECONNREFUSED"; break;
		case WSAEHOSTDOWN: msgText = "WSAEHOSTDOWN"; break;
		case WSAEHOSTUNREACH: msgText = "WSAEHOSTUNREACH"; break;
		case WSAEPROCLIM: msgText = "WSAEPROCLIM"; break;
		case WSASYSNOTREADY: msgText = "WSASYSNOTREADY"; break;
		case WSAVERNOTSUPPORTED: msgText = "WSAVERNOTSUPPORTED"; break;
		case WSANOTINITIALISED: msgText = "WSANOTINITIALISED"; break;
		case WSAEDISCON: msgText = "WSAEDISCON"; break;
		case WSATYPE_NOT_FOUND: msgText = "WSATYPE_NOT_FOUND"; break;
		case WSAHOST_NOT_FOUND: msgText = "WSAHOST_NOT_FOUND"; break;
		case WSATRY_AGAIN: msgText = "WSATRY_AGAIN"; break;
		case WSANO_RECOVERY: msgText = "WSANO_RECOVERY"; break;
		case WSANO_DATA: msgText = "WSANO_DATA"; break;
		case WSA_INVALID_HANDLE: msgText = "WSA_INVALID_HANDLE"; break;
		case WSA_INVALID_PARAMETER: msgText = "WSA_INVALID_PARAMETER"; break;
		case WSA_IO_INCOMPLETE: msgText = "WSA_IO_INCOMPLETE"; break;
		case WSA_IO_PENDING: msgText = "WSA_IO_PENDING"; break;
		case WSA_NOT_ENOUGH_MEMORY: msgText = "WSA_NOT_ENOUGH_MEMORY"; break;
		case WSA_OPERATION_ABORTED: msgText = "WSA_OPERATION_ABORTED"; break;
		case WSASYSCALLFAILURE: msgText = "WSASYSCALLFAILURE"; break;
		default: msgText = "***ERROR***"; break;
	};
	return msgText;
};

string SetErrorMsgText(string msgText, int code) {
	return msgText + GetErrorMsgText(code);
};

int main() {
	setlocale(LC_ALL, "rus");
	WSADATA wsaData;
	SOCKET  sS;
	SOCKADDR_IN serv;
	serv.sin_family = AF_INET;
	serv.sin_port = htons(4000);
	serv.sin_addr.s_addr = INADDR_ANY;
	try {
		if (WSAStartup(MAKEWORD(2, 0), &wsaData) != 0)
			throw SetErrorMsgText("Startup: ", WSAGetLastError());
		if ((sS = socket(AF_INET, SOCK_STREAM, NULL)) == INVALID_SOCKET)
			throw  SetErrorMsgText("socket: ", WSAGetLastError());
		if (bind(sS, (LPSOCKADDR)&serv, sizeof(serv)) == SOCKET_ERROR)
			throw SetErrorMsgText("bind: ", WSAGetLastError());
		if (listen(sS, SOMAXCONN) == SOCKET_ERROR)
			throw SetErrorMsgText("listen: ", WSAGetLastError());
		SOCKET cS;
		SOCKADDR_IN clnt;
		memset(&clnt, 0, sizeof(clnt));
		int lclnt = sizeof(clnt);
		char ibuf[50], obuf[50] = "server: принято ";
		int libuf = 0, lobuf = 0;
		for (int i = 0; i < 1; ++i) {
			if ((cS = accept(sS, (sockaddr*)&clnt, &lclnt)) == INVALID_SOCKET)
				throw SetErrorMsgText("accept: ", WSAGetLastError());
			else
				cout << "\nClient connected.\n";
			if ((libuf = recv(cS, ibuf, sizeof(ibuf), NULL)) == SOCKET_ERROR)
				throw SetErrorMsgText("recv: ", WSAGetLastError());
			ibuf[libuf] = '\0';
			string obuf = "ECHO: " + (string)ibuf;
			if ((lobuf = send(cS, obuf.c_str(), strlen(obuf.c_str()) + 1, NULL)) == SOCKET_ERROR)
				throw SetErrorMsgText("send: ", WSAGetLastError());
			cout << "Client message: " << ibuf << "\n";
		}
		if (closesocket(cS) == SOCKET_ERROR)
			throw SetErrorMsgText("closesocket: ", WSAGetLastError());
		if (closesocket(sS) == SOCKET_ERROR)
			throw SetErrorMsgText("closesocket: ", WSAGetLastError());
		if (WSACleanup() == SOCKET_ERROR)
			throw SetErrorMsgText("Cleanup: ", WSAGetLastError());
		cout << "Client disconnected.\n\n";
	}
	catch (string errorMsgText) {
		WSACleanup();
		cout << '\n' << errorMsgText;
	}
	system("pause");
	return 0;
}