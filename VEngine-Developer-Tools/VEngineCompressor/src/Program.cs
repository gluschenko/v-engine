using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using System.IO;

namespace VEngineCompressor
{
    class Program
    {
        static List<string> Files = new List<string>();

        static void Main(string[] args)
        {
            string Version = "1.0";
            Console.Title = "VEngineCompressor " + Version;
            //
            string AppPath = StartupPath(1);
            string Path = StartupPath(2);
            Console.WriteLine("Working path: " + Path);

            Dictionary<string, string> Config = GetConfig(AppPath + @"\Config.txt");
            //

            if (Config.Count() > 0) 
            {
                try 
                {
                    string AssetsPath = Path + Config["assets_folder"];
                    string OutputPath = Path + Config["output_folder"];

                    if (!Directory.Exists(OutputPath)) Directory.CreateDirectory(OutputPath);

                    if (Directory.Exists(AssetsPath))
                    {
                        string JScript = "";
                        JScript += "//This code generated automatically (" + Console.Title + ")\r\n";
                        JScript += Config["assets_const"] + " = {\r\n";
                        //
                        GetFiles(AssetsPath);
                        //
                        int count = 0;
                        foreach (string s in Files)
                        {
                            string[] sarr = s.Split(new char[] { '\\' }, StringSplitOptions.RemoveEmptyEntries);
                            string[] name = sarr[sarr.Length - 1].Split(new char[] { '.' }, StringSplitOptions.RemoveEmptyEntries);
                            //
                            JScript += string.Format("    {0}: \"{1}\",\r\n", name[0], CreateBase64(s));
                            //
                            Console.WriteLine(count + ": " + s);
                            count++;
                        }

                        JScript += "};\r\n";
                        JScript += "//\r\n//End of auto-code\r\n//\r\n";

                        //

                        if(Directory.Exists(OutputPath))
                        {
                            CreateOutput(OutputPath + Config["output_js"], JScript);
                            Console.WriteLine("Done!");
                        }
                        else
                        {
                            Console.WriteLine("Not found: " + OutputPath);
                        }
                    }
                    else 
                    {
                        Console.WriteLine("Not found: " + AssetsPath);
                    }
                }
                catch(Exception e)
                {
                    Console.WriteLine(e.ToString());
                }
            }
            else
            {
                Console.WriteLine("Config is empty");
            }

            Console.WriteLine("Press any key to exit...");
            Console.ReadKey();
        }

        public static string CreateBase64(string path)
        {
            byte[] FileBytes = File.ReadAllBytes(path);
            string BaseData =  Convert.ToBase64String(FileBytes);
            string SrcData = string.Format("data:{0};base64,{1}", GetMIME(path), BaseData);
            //
            return SrcData;
        }

        public static string GetMIME(string path) 
        {
            string MIME = "text/text";

            if (path.Contains(".png")) MIME = "image/png";
            if (path.Contains(".mp3")) MIME = "audio/mp3";
            if (path.Contains(".ogg")) MIME = "audio/ogg";
            if (path.Contains(".wav")) MIME = "audio/wav";
            if (path.Contains(".mp4")) MIME = "video/mp4";
            if (path.Contains(".webm")) MIME = "video/webm";

            return MIME;
        }

        //

        static string StartupPath(int Depth = 1) //Getting the path of this assembly
        {
            string[] PathArray = System.Reflection.Assembly.GetExecutingAssembly().Location.Split(@"\".ToCharArray());
            string Path = "";
            for (int i = 0; i < PathArray.Length - Depth; i++) Path += PathArray[i] + @"\";
            Path = Path.Substring(0, Path.Length - 1);
            //
            return Path;
        }

        static Dictionary<string, string> GetConfig(string Path)
        {
            Dictionary<string, string> Config = new Dictionary<string, string>();

            if (File.Exists(Path))
            {
                string Data = File.ReadAllText(Path);

                string[] Lines = Data.Split(new char[] { '\r', '\n' }, System.StringSplitOptions.RemoveEmptyEntries);

                foreach (string l in Lines)
                {
                    string[] la = l.Split(new char[] { '=' });

                    Config.Add(la[0], la[1]);
                }
            }
            else
            {
                using (StreamWriter S = File.CreateText(Path))
                {
                    string[] lines = new string[] {
                        @"assets_folder=\engine\game\assets",
                        @"output_folder=\engine\game\auto",
                        @"assets_const=_ASSETS",
                        @"output_js=\Base64Files.js",
                    };

                    foreach (string l in lines) S.WriteLine(l);

                    S.Close();

                    return GetConfig(Path); //Риск повиснуть
                }
            }

            return Config;
        }

        static void CreateOutput(string Path, string Data)
        {
            using (StreamWriter S = File.CreateText(Path))
            {
                S.Write(Data);
                S.Close();
            }
        }

        static void GetFiles(string path) 
        {
            DirectoryInfo Dir = new DirectoryInfo(path);
            DirectoryInfo[] SubDirs = Dir.GetDirectories();

            if(Dir.Exists)
            {
                FileInfo[] dirFiles = Dir.GetFiles();
                foreach (FileInfo F in dirFiles)
                {
                    string newPath = Path.Combine(path, F.Name);
                    Files.Add(newPath);
                }

                foreach (DirectoryInfo D in SubDirs)
                {
                    string dirPath = Path.Combine(path, D.Name);
                    GetFiles(dirPath);
                }
            }
        }
    }
}
