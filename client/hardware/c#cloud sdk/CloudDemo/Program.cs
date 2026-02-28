using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using SuperSocket.SocketEngine;
using SuperSocket.SocketBase;
using SuperSocket.Common;
using System.IO;
using System.Reflection;
using SuperWebSocket;
using System.ComponentModel;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

using System.Data;

namespace CloudDemo
{
    static class Program
    {
        /// <summary>
        /// 应用程序的主入口点。
        /// </summary>
        static void Main(string[] args)
        {

            string path = @"c:\EnrollPhoto";
            if (!Directory.Exists(path))
            {
               
                Directory.CreateDirectory(path);
            }
            string pathlog = @"c:\EnrollPhoto\log";
            if (!Directory.Exists(pathlog))
            {

                Directory.CreateDirectory(pathlog);
            }
            if ((!Platform.IsMono && !Environment.UserInteractive) || (Platform.IsMono && !AppDomain.CurrentDomain.FriendlyName.Equals(Path.GetFileName(Assembly.GetEntryAssembly().CodeBase))))
            {
                Program.RunAsService();
            }
            else
            {
                if (args != null && args.Length > 0)
                {
                    if (args[0].Equals("-i", StringComparison.OrdinalIgnoreCase))
                    {
                        SelfInstaller.InstallMe();
                    }
                    else
                    {
                        if (args[0].Equals("-u", StringComparison.OrdinalIgnoreCase))
                        {
                            SelfInstaller.UninstallMe();
                        }
                        else
                        {
                            Console.WriteLine("Invalid argument!");
                        }
                    }
                }
                else
                {
                    Program.RunAsConsole();
                }
            }
        }
        #region windows服务
        private static void RunAsService()
        {
            ServiceBase[] servicesToRun = new ServiceBase[]
			{
				new WebSocketService()
			};
            ServiceBase.Run(servicesToRun);
        }
        #endregion
        #region 控制台的方式
        private static bool setConsoleColor;
        private static void SetConsoleColor(ConsoleColor color)
        {
            if (setConsoleColor)
            {
                Console.ForegroundColor = color;
            }
        }
        private static void CheckCanSetConsoleColor()
        {
            try
            {
                Console.ForegroundColor = ConsoleColor.Green;
                Console.ResetColor();
                setConsoleColor = true;
            }
            catch
            {
                setConsoleColor = false;
            }
        }
        /// <summary>
        /// 新的会话链接
        /// </summary>
        /// <param name="session"></param>
        private static void wsServer_NewSessionConnected(WebSocketSession session)
        {

            Console.WriteLine("Starting..." + session.RemoteEndPoint);
            LogHelper.Receive("NewConnected[" + session.RemoteEndPoint + "]");
        }
        private static void RunAsConsole()
        {
            int startTime;
            int endTime;
            int runTime;
            List<string> tasks = new List<string>();
            //BackgroundWorker receiveWorker;
            CheckCanSetConsoleColor();
            Console.WriteLine("Press any key to start the SuperSocket ServiceEngine!");
            Console.ReadKey();
            Console.WriteLine();
            Console.WriteLine("Initializing...");

            

            IBootstrap bootstrap = BootstrapFactory.CreateBootstrap();
            if (!bootstrap.Initialize())
            {
                SetConsoleColor(ConsoleColor.Red);
                Console.WriteLine("Failed to initialize SuperSocket ServiceEngine! Please check error log for more information!");
                Console.ReadKey();
            }
            else
            {
                //var socketServer = bootstrap.AppServers.FirstOrDefault(s => s.Name.Equals("SuperWebSocket")) as WebSocketServer;
                //var secureSocketServer = bootstrap.AppServers.FirstOrDefault(s => s.Name.Equals("SecureSuperWebSocket")) as WebSocketServer;


                //secureSocketServer.NewSessionConnected += wsServer_NewSessionConnected;

                ///////////////////////////////database load
                DataSet dsEnrolls;
                EnrollData ed = new EnrollData();
                ed.New("./");
                dsEnrolls = EnrollData.DataModule.GetEnrollDatas();
                //////////////////////////////////

                Console.WriteLine("Starting...");
                StartResult result = bootstrap.Start();
                Console.WriteLine("-------------------------------------------------------------------");
                foreach (IWorkItem server in bootstrap.AppServers)
                {
                    //装载事件
                    WebSocketLoader.Setup(server);
                    if (server.State == ServerState.Running)
                    {
                        SetConsoleColor(ConsoleColor.Green);
                        Console.WriteLine("- {0} has been started", server.Name);
                    }
                    else
                    {
                        SetConsoleColor(ConsoleColor.Red);
                        Console.WriteLine("- {0} failed to start", server.Name);
                    }
                }
                Console.ResetColor();
                Console.WriteLine("-------------------------------------------------------------------");
                switch (result)
                {
                    case StartResult.None:
                        SetConsoleColor(ConsoleColor.Red);
                        Console.WriteLine("No server is configured, please check you configuration!");
                        Console.ReadKey();
                        return;

                    case StartResult.Success:
                        Console.WriteLine("The SuperSocket ServiceEngine has been started!");
                        break;

                    case StartResult.PartialSuccess:
                        SetConsoleColor(ConsoleColor.Red);
                        Console.WriteLine("Some server instances were started successfully, but the others failed! Please check error log for more information!");
                        break;

                    case StartResult.Failed:
                        SetConsoleColor(ConsoleColor.Red);
                        Console.WriteLine("Failed to start the SuperSocket ServiceEngine! Please check error log for more information!");
                        Console.ReadKey();
                        return;
                }
               
                Console.ResetColor();
                Console.WriteLine("Press key 'q' to stop the ServiceEngine.");
                ///////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////
                //////////////below test the demo :server active send the command to terminal
                string str;
                string functionstr;
                string snstr;
                bool i = true;
                while (i==true)
                {
                    str = Console.ReadLine();
                    string[] parts = str.Split(' ');
                    if (parts.Length >= 2)
                    {
                        functionstr = parts[0];
                        snstr = parts[1];
                        if (!WebSocketLoader.GetSessionBySN(snstr))
                        {
                            functionstr = "";
                            Console.WriteLine("Device not online");
                        }
                    }
                    else
                    {
                        functionstr = parts[0];
                        snstr = WebSocketLoader.g_now_sn;
                    }
                    switch (functionstr)
                    {
                        case "stop":
                            i=false;
                            break;
                        case "getuserlist":
                            WebSocketLoader.getuserlist(snstr);
                            break;
                        case "getuserinfo":
                            WebSocketLoader.getuserinfo(snstr, 1, 0);
                                break;
                        case "getallusers":
                                WebSocketLoader.getallusers(snstr);
                                break;
                        case "setpwd":
                                WebSocketLoader.setuserinfo(snstr, 1, "TEST", 10, 0, 123456, null);
                                break;
                        case "setcard":
                                WebSocketLoader.setuserinfo(snstr, 1, "TEST", 11, 0, 2352253, null);
                                break;
                        case "setfp":
                               //thbio 1.0 
                              
                               //thbio 3.0
                                WebSocketLoader.setuserinfo(snstr, 1, "TEST", 0, 0, 0, "c52c5b0081885a2107c5f903138a3276f83bf6c21689ca71ff3607417a876aa50fc7b343e88592b9073427040186a2cd077224c40987aae5007423838e8a9b2917ffd48207870b4de8b036857886f381300b96c80b86fba5e0ac47c9938af3a217ffca02db8543fdea3448872188a409e03027c5998a740e1705c983e3858c21dbb069482587ac2ddeaa28c7278ad429f8761a431486643ddc24491422873c45e4e839882e8ad499ff740843a8888cf11f47a7063688f501e0322845d0856d26e6a8db895d85e516cf1d2acd5386153ddf62384acc853d56ff7ecc5b39897d65d8742784368a6569f8761783ab8b1d7517ffca45d0856d99ff3f4e184a8795dde073f7034687fde9e8b5f702b7897e250fffb9820485cc7dcce87ad339866501d8a05a5443870d66e0ac3a4547892e3ef835fcc2bd87ee3d1fffb74236850515efcf36cdb384054ef9325c8939846d4a2fcd790a26843db957fff707c3874e3127ffa7c4(128)616695418a367a229651f85828c645836ce74336432579354944444f52f681f2233a71f3223943226fcf36845949624897532292423532a4f4113f49f7ff4f628947543361f0ffff384478324fa4f5662f232cf4f6629f244223f32228(19)1e5b721533d2cb81d54d52d5e9714332111125957d233370a172d074350486626e683525a871851c241192a4013311690392802b006212a582115114eb8123172548e4810d21214056a3d46522d07b302b2d017032822849026101b2313721124141f87615725290916631108730342f0021c1632f1a1441b8718e420150d6c65c66616266a0fc326461538083122100dee68b2d13758e409a2461508e92ce220036c2714c76746436700f213030a2700f104a03dc90100d120a0915220f23160c18061917050e03271b1a11141e07292b022600fe14");
                                break;
                        case "setphoto":
                                /////////////////////you can load jpg from file or database 
                                int enrolid=1;
                                string path = @"C:\\EnrollPhoto\" + "LF" + enrolid.ToString().PadLeft(8, '0') + ".jpg";  
                                bool bRet = System.IO.File.Exists(path);
                                 if (bRet)  
                                {
                                     byte[] rawjpg = System.IO.File.ReadAllBytes(path);
                                     string base64string = Convert.ToBase64String(rawjpg);
                                     WebSocketLoader.setuserinfo(snstr, 1, "chingzou", 50, 0, 0, base64string);
  
                                 }
                                 else
                                 {
                                     Console.WriteLine("Picture does not exist");
                                 }                                
                                break;
                        case "getname":
                                WebSocketLoader.getusername(snstr, 1);
                                break;
                        case "setname":
                                WebSocketLoader.setusername(snstr);
                                break;
                        case "deleteuser":
                                WebSocketLoader.deleteuser(snstr, 1,13); //0~9 :fp  10 pwd ;11: card ;12: all fp ;13 :all(fp pwd card name)
                                break;
                        case "enableuser":
                                WebSocketLoader.enableuser(snstr, 1, true); //1 for enalbe the user
                                break;
                        case "disableuser":
                                WebSocketLoader.enableuser(snstr, 1, false); // 0 for disable the user
                                break;
                        case "cleanuser":
                                WebSocketLoader.cleanuser(snstr);
                               break;
                        case "getnewlog":
                               WebSocketLoader.getnewlog(snstr);
                                break;
                        case "getalllog":
                                WebSocketLoader.getalllog(snstr);                         
                            break;
                        case "cleanlog":
                            WebSocketLoader.cleanlog(snstr);
                            break;
                        case "initsys":
                            WebSocketLoader.initsys(snstr);
                            break; 
                        case "cleanadmin":
                            WebSocketLoader.cleanadmin(snstr);
                            break;
                        case "setdevinfo":
                            WebSocketLoader.setdevinfo(snstr);
                            break;
                        case "getdevinfo":
                            WebSocketLoader.getdevinfo(snstr);
                            break;
                        case "opendoor":
                            WebSocketLoader.opendoor(snstr);
                            break;
                        case "setdevlock":
                            WebSocketLoader.setdevlock(snstr);
                            break;
                        case "getdevlock":
                            WebSocketLoader.getdevlock(snstr);
                            break;
                        case "setuserlock":
                            WebSocketLoader.setuserlock(snstr);
                            break;
                        case "getuserlock":
                            WebSocketLoader.getuserlock(snstr, 2);
                            break; 
                        case "deleteuserlock":
                            WebSocketLoader.deleteuserlock(snstr, 1);
                            break;
                        case "cleanuserlock":
                            WebSocketLoader.cleanuserlock(snstr);
                            break;
                        case "reboot":
                            WebSocketLoader.reboot(snstr);
                            break;
                        case "settime":
                            WebSocketLoader.settime(snstr);
                            break;
                        case "gettime":
                            WebSocketLoader.gettime(snstr);
                            break;

                        case "disabledevice":
                            WebSocketLoader.disabledevice(snstr);
                            break;
                        case "enabledevice":
                            WebSocketLoader.enabledevice(snstr);
                            break;
                        case "adduser":
                            ////////0~9 fp  10 pwd 11 card 50:aiface
                            WebSocketLoader.adduser(snstr, 888, 50, 0, "test");
                            break;                        
                      
						case "setprofile":
							WebSocketLoader.setuserprofile(snstr,1,"1,3,5"); //can use \\n to wrap max is 4096,but display is 110
							break;
						case "getprofile":
							WebSocketLoader.getuserprofile(snstr,1); //0 is notice >0 is the users
							break;
                        ////////////////////////////////////////////for debug
                        case "uploadalluser":
                             DataTable dbEnrollTble;
                             DataRow dbRow;
                             DataSet dsChange;
                             bool doubleid = false;

                             dbEnrollTble = dsEnrolls.Tables[0];

                            int startalltime = System.Environment.TickCount;
                            int errorcount = 0;
                            WebSocketLoader.disablereturn = false;
                            WebSocketLoader.disabledevice(snstr);
                            while (!WebSocketLoader.disablereturn);
                            WebSocketLoader.getuserlistreturn = false;
                            WebSocketLoader.userlistindex = 0;
                            WebSocketLoader.getuserlist(snstr);
                            while (!WebSocketLoader.getuserlistreturn);
                            int a = 0;
                            while(a < WebSocketLoader.userlistindex)
                            {
                                errorcount = 0;
                            getagain:
                                WebSocketLoader.getuserinfoflag = false;
                                SetConsoleColor(ConsoleColor.Green);
                                Console.WriteLine("index:"+a+"==>getuser:" + WebSocketLoader.str_userlist[a].enrollid + ";backupnum:" + WebSocketLoader.str_userlist[a].backupnum);
                                CheckCanSetConsoleColor();
                                startTime = System.Environment.TickCount;
                                WebSocketLoader.getuserinfo(snstr, WebSocketLoader.str_userlist[a].enrollid, WebSocketLoader.str_userlist[a].backupnum);
                                while (!WebSocketLoader.getuserinfoflag && System.Environment.TickCount - startTime<10000) ;
                               if( System.Environment.TickCount - startTime>=10000)
                               {
                                   if (errorcount > 3)
                                   {
                                       Console.WriteLine("error!!!!!!!!!!!!!!!!!!!");
                                       goto getend;
                                   }
                                   else
                                       goto getagain;
                               }

                                endTime = System.Environment.TickCount;
                                runTime=endTime-startTime;
                                SetConsoleColor(ConsoleColor.Red);
                                Console.WriteLine("time=" + runTime+"ms");
                                CheckCanSetConsoleColor();
                                ////////////////////////////save to database
                                doubleid = false;
                                foreach (DataRow dbRow1 in dbEnrollTble.Rows)
                                {
                                    if ((int)dbRow1["EnrollNumber"] == WebSocketLoader.tmpuserinfo.enrollid)
                                    {
                                        if ((int)dbRow1["FingerNumber"] == WebSocketLoader.tmpuserinfo.backupnum)
                                        {
                                            doubleid = true;
                                            break;
                                        }
                                    }
                                }
                                if (doubleid == false)
                                {
                                dbRow = dbEnrollTble.NewRow();
                                dbRow["EnrollNumber"] = WebSocketLoader.tmpuserinfo.enrollid;
                                dbRow["FingerNumber"] = WebSocketLoader.tmpuserinfo.backupnum;
                                dbRow["Privilige"] = WebSocketLoader.tmpuserinfo.admin;
                                dbRow["Password1"] = 0;
                                dbRow["Username"] = WebSocketLoader.tmpuserinfo.name;
                                if (WebSocketLoader.tmpuserinfo.backupnum >= 20 && WebSocketLoader.tmpuserinfo.backupnum < 28) //face
                                {
                                    
                                    dbRow["FPdata"] = WebSocketLoader.tmpuserinfo.fpdata;
                                }
                                else if (WebSocketLoader.tmpuserinfo.backupnum == 10 || WebSocketLoader.tmpuserinfo.backupnum == 11) //card or pwd
                                {
                                    dbRow["Password1"] = (double)WebSocketLoader.tmpuserinfo.password;                                   
                                    dbRow["FPdata"] = "";
                                }
                                else if (WebSocketLoader.tmpuserinfo.backupnum == 50) //50 is aiface photo base 64
                                {
                                   
                                    dbRow["FPdata"] = WebSocketLoader.tmpuserinfo.fpdata;
                                    /////////////////////////decode base 64
                                    Console.WriteLine("StartingEnrollPhoto");
                                    byte[] rawjpg = Convert.FromBase64String(WebSocketLoader.tmpuserinfo.fpdata);
                                    System.IO.File.WriteAllBytes(@"C:\\EnrollPhoto\" + "LF" + WebSocketLoader.tmpuserinfo.enrollid.ToString().PadLeft(8, '0') + ".jpg", rawjpg);
                                }                                
                                else  // 0~9 //fingerprint  // 
                                {
                                    
                                    dbRow["FPdata"] = WebSocketLoader.tmpuserinfo.fpdata;

                                }
                                dbEnrollTble.Rows.Add(dbRow);
                                }
                                a++;
                                ////////////////////////////////
                            }
                             WebSocketLoader.enablereturn = false;
                             WebSocketLoader.enabledevice(snstr);
                            while (!WebSocketLoader.enablereturn) ;
                    getend:
                            dsChange = dsEnrolls.GetChanges();
                            EnrollData.DataModule.SaveEnrolls(dsEnrolls);
                            SetConsoleColor(ConsoleColor.Red);
                            Console.WriteLine("alltimes=" + (System.Environment.TickCount - startalltime) + "ms");
                            CheckCanSetConsoleColor();
                            break;
                     case "downloadalluser":
                            int vEnrollNumber;
                            int vFingerNumber;
                            int vPrivilege;
                            double glngEnrollPData;
                            string username;
                            string fpdata;

                            errorcount = 0;
                            startalltime = System.Environment.TickCount;                           
                            dbEnrollTble = dsEnrolls.Tables[0];
                            if (dbEnrollTble.Rows.Count == 0)
                            {
                                SetConsoleColor(ConsoleColor.Red);
                                Console.WriteLine("no data in database!");
                                CheckCanSetConsoleColor();
                                break;
                            }
                            Console.WriteLine("allcount=" + dbEnrollTble.Rows.Count);
                            WebSocketLoader.disablereturn = false;
                            WebSocketLoader.disabledevice(snstr);
                            while (!WebSocketLoader.disablereturn) ;
                            a = 1;
                            foreach (DataRow dbRow2 in dbEnrollTble.Rows)
                            {
                                errorcount = 0;
                                vEnrollNumber = (int)dbRow2["EnrollNumber"];
                                vFingerNumber = (int)dbRow2["FingerNumber"];
                                vPrivilege = (int)dbRow2["Privilige"];                                
                                username = (string)dbRow2["Username"];
                                if (vFingerNumber == 10 || vFingerNumber == 11) //is card or password
                                {
                                    glngEnrollPData = (double)dbRow2["Password1"];
                                    fpdata = "";
                                }                           
                                else //is fp or face
                                {
                                    glngEnrollPData = 0;
                                    fpdata = (string)dbRow2["FPdata"];
                                }
                            sendagain:
                                SetConsoleColor(ConsoleColor.Green);
                                Console.WriteLine("index:"+a+":enrollid:" + vEnrollNumber + ",backnum=" + vFingerNumber+",name="+username);
                                CheckCanSetConsoleColor();
                                WebSocketLoader.setuserinfoflag = false;
                                startTime = System.Environment.TickCount;
                                WebSocketLoader.setuserinfo(snstr, vEnrollNumber, username, vFingerNumber, vPrivilege, glngEnrollPData, fpdata);
                                while (!WebSocketLoader.setuserinfoflag && System.Environment.TickCount - startTime < 10000) ;
                                if (System.Environment.TickCount - startTime >= 10000)
                                {
                                    errorcount++;
                                    if (errorcount > 3)
                                    {
                                        Console.WriteLine("error!!!!!!!!!!!!!!!!!!!");
                                        goto sendend;
                                    }
                                    else
                                        goto sendagain;
                                }
                                endTime = System.Environment.TickCount;
                                runTime = endTime - startTime;
                                SetConsoleColor(ConsoleColor.Red);
                                Console.WriteLine("time=" + runTime + "ms");
                                CheckCanSetConsoleColor();
                                a++;

                            }                           
                            WebSocketLoader.enablereturn = false;
                            WebSocketLoader.enabledevice(snstr);
                            while (!WebSocketLoader.enablereturn) ;
                    sendend:
                             SetConsoleColor(ConsoleColor.Red);
                            Console.WriteLine("alltimes=" + (System.Environment.TickCount - startalltime) + "ms");
                            CheckCanSetConsoleColor();
                            break;
                        case "getholiday":
                            WebSocketLoader.getholiday(snstr, 0);
                            break;
                        case "setholiday":
                            int[] accessidbuf = new int[100];
                            int c=0;
                            int b=0;

                            for (b = 0; b < 30; b++) //can accept 3000 id
                            {
                                for (c = 0; c < 100; c++)
                                {
                                    accessidbuf[c] = b * 100 + c + 1;
                                }
                                WebSocketLoader.setholidayflag = false;
                                if(b==0)
                                    WebSocketLoader.setholiday(snstr, 0, true, 100, accessidbuf); //start frame
                                else
                                    WebSocketLoader.setholiday(snstr, 0, false, 100, accessidbuf); //others
                                while (!WebSocketLoader.setholidayflag) ;  //waiting for return;
                            }
                            Console.WriteLine("setholiday ok");
                            break;
                        case "deleteholiday":
                            WebSocketLoader.deleteholiday(snstr, 0);
                            break;
                        case "cleanholiday":
                            WebSocketLoader.cleanholiday(snstr);
                            break;
                        case "cleandb":
                            EnrollData.DataModule.DeleteDB();
                            Console.WriteLine("delete db ok");
                            break;
                        default:
                            Console.WriteLine("can not find this command!");
                            break;
                    }                    
                }
                bootstrap.Stop();
                Console.WriteLine();
                Console.WriteLine("The SuperSocket ServiceEngine has been stopped!");
            }
        }
        #endregion



    }
}
