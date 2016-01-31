using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//
using System.IO;
//
using System.Dynamic;
using Yahoo.Yui.Compressor;


namespace VEngineComposer
{
    class Program
    {
        static void Main(string[] args)
        {
            string Version = "1.0";
            Console.Title = "VEngineComposer " + Version;
            //
            string AppPath = StartupPath(1);
            string Path = StartupPath(2);
            Console.WriteLine("Working path: " + Path);
            
            Dictionary<string, string> Config = GetConfig(AppPath + @"\Config.txt");

            string OutputDir = AppPath + Config["output_dir"];
            if (!Directory.Exists(OutputDir)) 
            {
                Directory.CreateDirectory(OutputDir);

                if (!Directory.Exists(OutputDir + @"\game"))
                {
                    Directory.CreateDirectory(OutputDir + @"\game");
                }
            }
            //

            if (Directory.Exists(Path + Config["code_folder"] + @"\game\assets"))
            {
                Console.WriteLine("Copying assets...");
                DirectoryCopy(Path + Config["code_folder"] + @"\game\assets", OutputDir + @"\game\assets");
            }

            //

            if (Config.Count() > 0)
            {
                try 
                {
                    string[] JSFiles = ParseLoader(Path + Config["code_folder"] + Config["js_loader"], Config["loader_const"]);

                    if (JSFiles.Length != 0)
                    {
                        string JavaScriptCode = "";

                        for (int i = 0; i < JSFiles.Length; i++ )
                        {
                            Console.WriteLine((i + 1) + ". Add file: " + JSFiles[i]);
                            //
                            string Data = File.ReadAllText(Path + Config["code_folder"] + @"\" + JSFiles[i]);
                            JavaScriptCode += Data + Environment.NewLine;
                        }
                        //
                        Console.WriteLine("Creating an output #1...");
                        //
                        string FirstOutput = AppPath + Config["output_dir"] + @"\output_1.js";
                        CreateOutput(FirstOutput, JavaScriptCode);
                        //
                        Console.WriteLine("Output #1 has been created...");
                        //
                        Console.WriteLine("Creating an output #2...");
                        //
                        string SecondOutput = AppPath + Config["output_dir"] + @"\output_2.js";
                        CreateOutput(SecondOutput, "");
                        Compress(JavaScriptCompressor.Compress, FirstOutput, SecondOutput);
                        //
                        Console.WriteLine("Output #2 has been created...");
                        //
                        /*Console.WriteLine("Creating an output #3...");
                        //
                        string ThirdOutput = AppPath + Config["output_dir"] + @"\output_3.js";
                        CreateOutput(ThirdOutput, "");
                        Obfuscate(SecondOutput, ThirdOutput);
                        //
                        Console.WriteLine("Output #3 has been created...");*/
                        //
                    }
                    else 
                    {
                        Console.WriteLine("No files");
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

                foreach(string l in Lines)
                {
                    string[] la = l.Split(new char[] { '=' });

                    Config.Add(la[0], la[1]);
                }
            }
            else 
            {
                using(StreamWriter S = File.CreateText(Path))
                {
                    string[] lines = new string[] {
                        @"code_folder=\engine",
                        @"js_loader=\Loader.js",
                        @"loader_const=_FILES",
                        @"output_dir=\output",
                    };

                    foreach (string l in lines) S.WriteLine(l);

                    S.Close();

                    return GetConfig(Path); //Риск повиснуть
                }
            }

            return Config;
        }

        static string[] ParseLoader(string Path, string LoaderConst) 
        {
            List<string> files = new List<string>();

            if (File.Exists(Path))
            {
                string Data = File.ReadAllText(Path);
                string[] DataArray = Data.Split(new char[] { ';' }, StringSplitOptions.RemoveEmptyEntries);

                foreach(string op in DataArray)
                {
                    string[] opArray = op.Split(new char[] { '=' });

                    if(opArray[0].Contains("var " + LoaderConst))
                    {
                        string[] ArrArr = opArray[1].Split(new char[] { '[', ']' }); //var _FILES = [ "", "", "", ];
                        string ArrBody = ArrArr[1];
                        string[] BodyArray = ArrBody.Split(new char[] { ',' });

                        foreach (string el in BodyArray) 
                        {
                            string[] elArr = el.Split(new char[] { '"', '\'' });

                            if (elArr.Length >= 3) //Убеждаемся в том, что - это то, что нам нужно.
                            {
                                string file = elArr[1];

                                if (file != "") 
                                {
                                    files.Add(file);
                                }
                            }
                        }
                    }
                }
            }

            return files.ToArray();
        }

        static void CreateOutput(string Path, string Data)
        {
            using (StreamWriter S = File.CreateText(Path))
            {
                S.Write(Data);
                S.Close();
            }
        }

        static void DirectoryCopy(string from, string to) 
        {
            DirectoryInfo Dir = new DirectoryInfo(from);
            DirectoryInfo[] SubDirs = Dir.GetDirectories();

            if(Dir.Exists)
            {
                if (Directory.Exists(to))Directory.Delete(to, true);
                Directory.CreateDirectory(to);
                //
                FileInfo[] Files = Dir.GetFiles();
                foreach(FileInfo F in Files)
                {
                    string newPath = Path.Combine(to, F.Name);
                    F.CopyTo(newPath, false);
                }

                foreach(DirectoryInfo D in SubDirs)
                {
                    string newPath = Path.Combine(to, D.Name);
                    DirectoryCopy(D.FullName, newPath);
                }
            }
        }

        //

        static void Compress(Func<string, string> Engine, string from, string to) 
        {
            try
            {
                if (File.Exists(from) && File.Exists(to))
                {
                    string Data = File.ReadAllText(from);
                    File.WriteAllText(to, Engine(File.ReadAllText(from)));
                }
                else 
                {
                    Console.WriteLine("One of selected files does not exists");
                }
            }
            catch(Exception e)
            {
                Console.WriteLine(string.Format("Failed to compress selected file ({0})", from));
                Console.WriteLine(e.ToString());
            }
        }

        //

        static void Obfuscate(string from, string to) 
        {
            /*string APIKey = "";
            string Password = "";

            bool Secuess = false;

            JSOProject proj = null;
            try
            {
                proj = new JSOProject(APIKey, Password);
                Secuess = true;
            }
            catch (Exception)
            {
                Console.WriteLine("Invalid apikey or password");
            }

            if (Secuess) 
            {
                proj.Name = "VPilerOBF";
                proj.ReplaceNames = true;
                proj.EncodeStrings = true;
                proj.MoveMembers = true;
                proj.CompressionRatio = CompressionRatio.Low;
                proj.MoveStrings = true;
                //proj.RenameGlobals = true;

                //proj.DeepObfuscate = true;
                //proj.ReorderCode = true;
                //
                JSOItem Item = proj.AddCode("code.js", File.ReadAllText(from));
                //
                Action<string> onProgress = delegate(string msg)
                {
                    Console.WriteLine("Obfuscation: " + msg);
                };
                //
                JSOResult Result = proj.Protect(onProgress);

                if (Result.Type == JSOResultType.Succeed)
                {
                    Console.WriteLine("SUCCEED!");

                    //Копирайты мы шлём нах*й!
                    string Header = "";

                    string OutCode = Item.OutputCode.Replace(Header, "");

                    File.WriteAllText(to, OutCode);
                }
                else 
                {
                    Console.WriteLine("FAILED: " + Result.Type + ", " + Result.ErrorCode);
                    string err = Result.Exception != null ? Result.Exception.Message : Result.Message;
                    Console.WriteLine(err);
                }
            }*/
        }
    }
}
