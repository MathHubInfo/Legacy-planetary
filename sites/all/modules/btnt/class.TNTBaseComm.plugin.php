<?php

// Copyright (C) 2010-2011, Planetary System Developer Group. All rights reserved.
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>
//require_once (PATH_APPLICATIONS."/articles/models/class.articlemodel.php");

define('TNTBase.sTeXTransform', '1');
define('TNTBase.FetchSourceURL', 'https://tnt.kwarc.info/repos/stc');
define('TNTBase.FetchPresentationURL', 'https://tnt.kwarc.info/tntbase/stc/restful/planet/children');
define('TNTBase.CreatePresentationURL', "https://tnt.kwarc.info/tntbase/stc/restful/jomdoc/render");
define('TNTBase.CommitFilesURL', 'https://tnt.kwarc.info/tntbase/stc/restful/content/commit');
define('TNTBase.CommitXMLURL', 'https://tnt.kwarc.info/tntbase/stc/restful/content/doc');
define('TNTBase.Username', 'planetarybroker');
define('TNTBase.Password', 'n3pt4n3');
define('TNTBase.XQueryURL', 'https://tnt.kwarc.info/tntbase/stc/restful/query');
define('TNTBase.DocumentNamesURL', 'https://tnt.kwarc.info/tntbase/stc/restful/names/getDocNames');
define('TNTBase.FolderContentsURL', 'https://tnt.kwarc.info/tntbase/stc/restful/urlContent');
define('TNTBase.LogURL', 'https://tnt.kwarc.info/tntbase/stc/restful/util/log');
define('TNTBase.FileRevisionURL', 'https://tnt.kwarc.info/tntbase/stc/restful/util/file-revs');

function C($a) {
    return constant($a);
}

require_once ("class.WebRequest.plugin.php");
class TNTBaseComm {
/////////////////////////////////// STATIC FUNCTIONALITY //////////////////////////////////////////////////////

    /**
     * Method for importing the entire content under a specific repository path
     * @param string $RootPath the path to the desired place of import
     * @return an array of associative arrays of (Body, BodyXHTML, TitleXHTML, Revision, Path) to be considered as documents, or <b>false</b> in case of an error
     */
    static public function ImportRepository($RootPath) {
        $Files = TNTBaseComm::_GetDocumentNames($RootPath);

        if (false == $Files) {
            return false;
        }

        $Documents = array();
        foreach ($Files as $FilePath) {
            //TODO: remove this hack
            $PathInfo = pathinfo($FilePath);
            if ($PathInfo['filename'] == 'dummy') {
                continue;
            }

            $Document = TNTBaseComm::_GetDocument($FilePath);
            if (false == $Document) {
                return false;
            }
            $Documents[] = $Document;
        }

        return $Documents;
    }

    /**
     * Method used for retrieveing all of the relevant content for a set of documents
     * @param array $Documents the list of documents that need their content imported given as an array of paths to valid OMDOC documents in TNTBase
     * @return an array of associative arrays of (Body, BodyXHTML, TitleXHTML, Revision, Path) to be considered as documents, with <b>false</b> in case of an error  
     */
    static public function ImportDocuments($Documents) {
        $AllContent = array();
        foreach ($Documents as $FilePath) {
            $AllContent[] = TNTBaseComm::_GetDocument($FilePath);
        }

        return $AllContent;
    }

    /**
     * Method for getting all the revision numbers of a certain file when it was modified
     * @param string $FilePath the path into TNTBase of the file in question
     * @param bool $HeadOnly a flag to state if to get all of the revisions or just the head
     * @return an array of the revision numbers of a file in which it was modified, if they exist, <b>false</b> otherwise
     */
    static public function GetRevisions($FilePath, $Revision = false /* $HeadOnly = false */) {
        /*
          $URL = C('TNTBase.XQueryURL')."/tnt:file-revs('".$FilePath."')[last()]";
          if(false == $HeadOnly) {
          $URL = $URL."[last()]";
          }

          $Response = WebRequest::cURL_GET($URL);

          $Response = TNTBaseComm::_StripTNTBaseResults($Response);
          if(true == $HeadOnly) {
          $Response = $Response[count($Response) - 1];
          }
         */
        $URL = C('TNTBase.FileRevisionURL') . $FilePath;
        if (false !== $Revision) {
            $URL .= "?$Revision";
        }

        $Response = WebRequest::cURL_GET($URL);

        return $Response;
    }

    /**
     * Method used to return the head revision number
     * @return int the head revision number or <b>false</b> in case of errors
     */
    static public function GetHeadRevision() {
        $Response = WebRequest::cURL_GET(C('TNTBase.XQueryURL') . '/tnt:last-revnum()');
        $Response = TNTBaseComm::_StripTNTBaseResults($Response);
        $Response = $Response[0];

        // false or number
        return $Response;
    }

    /**
     * Method used to get the updated content that has grown out of sync with TNTBase
     * @param int $Revision the revision number from which to check for updates
     * @return an associative array of (A, D) going to arrays of paths to the OMDOC of the respectively Added or Deleted content or <b>false</b> if an error occurred
     */
    static public function GetContentChanges($Revision) {
        $HeadRevision = TNTBaseComm::GetHeadRevision();
        if (false == $HeadRevision ||
                $Revision > $HeadRevision) {
            return false;
        }
        $Log = TNTBaseComm::_GetLog($Revision, $HeadRevision);

        $A = $Log['A'];
        $Added = array();
        $D = $Log['D'];
        $Deleted = array();

        foreach ($A as $File) {
            $PathInfo = pathinfo($File);
            if ("tex" == $PathInfo['extension']) {
                $Added[] = $PathInfo['dirname'] . '/' . $PathInfo['filename'] . '.omdoc';
            }
        }
        foreach ($D as $File) {
            $PathInfo = pathinfo($File);
            if ("tex" == $PathInfo['extension']) {
                $Deleted[] = $PathInfo['dirname'] . '/' . $PathInfo['filename'] . '.omdoc';
            }
        }

        $Response = array('A' => $Added, 'D' => $Deleted);
        return $Response;
    }

    /**
     * Method to be used to get the content of a file path, none recursively, for organizing content at a position
     * @param string $FilePath the path to look at
     * @return the contents of the path in a key=>value array, with keys as FileName and values as types ('file' or 'directory or 'vdoc'')
     */
    static public function GetPathContents($FilePath) {
        $Response = WebRequest::cURL_GET(C('TNTBase.FolderContentsURL') . $FilePath);

        $Document = new DOMDocument();
        $Document->loadXML($Response);

        $Xpath = new DOMXPath($Document);
        $Xpath->registerNamespace('tnt', "http://tntbase.mathweb.org/ns");
        $Query = "//tnt:directory | //tnt:file | //tnt:vdoc";
        $Nodelist = $Xpath->query($Query);

        $Result = array();
        for ($i = 0; $i < $Nodelist->length; $i++) {
            $Name = $Nodelist->item($i)->getAttribute('name');
            if (!empty($Name)) {
                $Result[$Name] = substr($Nodelist->item($i)->tagName, 4);
            }
        }

        if (empty($Result) || $Nodelist->length == 0) {
            return false;
        }
        return $Result;
    }

    /**
     * Method used to get a set of bibliography entries for some keys at a particular location
     * @param array $Keys the keys that need bib resolving
     * @param string $Location the path towards to location of the bib item
     * @return an array of key => (text OR anchor to URL of the entry matched in the bib)
     */
    static public function GetBibliography($Keys, $Location = "/kwarc.xml") {
        $KeyString = "";
        foreach ($Keys as $Key) {
            $KeyString .= '"' . $Key . '",';
        }
        $KeyString = substr($KeyString, 0, -1);
        $Query =
                "declare namespace b = " . '"http://bibtexml.sf.net/"' . ';
			declare variable $keys := (' . $KeyString . ');' .
                'declare function tnt:get-authors($e as element(b:entry)) {
			  let $a := for $p in $e//b:person return concat ($p/b:first, " ", $p/b:last)
			  return string-join($a, ", ")
			};' .
                'declare function tnt:get-title($e as element(b:entry)) {
			  let $t := $e//b:title
			return $t
			};' .
                /*
                  (* let $t := replace($t, "\{", "") *)
                  (* let $t := replace($t, "\}", "") *)
                 */
                'let $entries := tnt:doc(' . '"' . $Location . '"' . ')//b:entry[@id=$keys]
			return 
			for $e in $entries return 
			<div class ="bibtex-entry" id="{ $e//@id }"><a name="{ $e//@id }"></a>
			{
			  if(not(empty($e//b:url))) 
			  then <a href="{$e//b:url}">{concat(tnt:get-authors($e), ". ", tnt:get-title($e))}</a> 
			  else concat(tnt:get-authors($e), ". ", tnt:get-title($e))
			}
			</div>';

        $Results = array();
        $Response = TNTBaseComm::Query($Query);
        $Document = new DOMDocument();
        foreach ($Response as $DIV) {
            $Document->loadXML($DIV);
            $Root = $Document->documentElement;
            $ID = $Root->getAttribute('id');
            $Results[$ID] = $Document->saveXML($Root);
            /*
              $Anchors = $Root->getElementsByTagName('a');
              if(0 == $Anchors->length) {
              $Results[$ID] = $Root->nodeValue;
              } else {
              $Results[$ID] = $Document->saveXML($Anchors->item(0));
              }
             */
            $Results[$ID] = str_replace(array("{", "}"), "", $Results[$ID]);
        }

        return $Results;
    }

    /**
     * Method to be used for fetching the source of a specific (S)TEX article corresponding file at the given path from TNTBase 
     * 
     * May get a .tex or .omdoc file and will look for the .tex source file
     * 
     * @param string $FilePath the path into TNTBase of the OMDOC file
     * @return the actual source file at that path or <b>false</b> if it didn't exist
     */
    static public function GetSource($FilePath) {
        // Checking if FilePath is .omdoc to convert it to tex
        $PathInfo = pathinfo($FilePath);
        if ('omdoc' == $PathInfo['extension']) {
            $FilePath = $PathInfo['dirname'] . '/' . $PathInfo['filename'] . '.tex';
        }

        $Response = WebRequest::cURL_GET(C('TNTBase.FetchSourceURL') . $FilePath);
        //TODO: FIX THIS HACK
        $Response = trim($Response);
        if ($Response[0] == "<") {
            return false;
        }

        return $Response;
    }

    /**
     * Method to be used for fetching the presentation of a specific article that exists in TNTBase
     * 
     * Needs a wrapper of '<span xmlns:m="http://www.w3.org/1998/Math/MathML">'
     * 
     * @param string $FilePath the path into TNTBase of the file in question
     * @return the presentation format of the requested file or <b>content saying error</b> if it didn't exist
     */
    static public function GetPresentation($FilePath) {
        $Error = "<div>Error: could not properly get the presentation of your article!</div>";
        // Checking for FilePath to be .omdoc else if .tex, querying for the .omdoc as needed
        $PathInfo = pathinfo($FilePath);
        if ('tex' == $PathInfo['extension']) {
            $FilePath = $PathInfo['dirname'] . '/' . $PathInfo['filename'] . '.omdoc';
        } elseif ('omdoc' != $PathInfo['extension']) {
            return $Error;
        }

        $Response = WebRequest::cURL_GET(C('TNTBase.FetchPresentationURL') . $FilePath);
        $OK = (substr($Response, 0, 5) != "Error");

        if ($OK == false) {
            return $Error;
        }

        return $Response;
    }

    /**
     * Method to be used for creating Presentation format on the fly.
     * 
     * Can be used in tandem with a repo, in which case, the $FilePath is needed for handling imports
     * 
     * @param string $Content the OMDoc content 
     * @param string $FilePath the optional path to the file
     * @return XHTML representing the Presentation format of the input OMDoc, or false on errors.
     */
    static public function CreatePresentation($Content, $FilePath = false) {
        //TODO: make this work
    }

    /**
     * Method to be used for fetching the title of a specific article that exists in TNTBase
     * @param string $FilePath the path into TNTBase of the file in question
     * @return the title of the specific file if it exists, else <b>a title saying error<b>
     */
    static public function GetTitle($FilePath) {
        // Checking for FilePath to be .omdoc else if .tex, querying for the .omdoc as needed
        $PathInfo = pathinfo($FilePath);
        $Error = $PathInfo['filename'];
        if ('tex' == $PathInfo['extension']) {
            $FilePath = $PathInfo['dirname'] . '/' . $PathInfo['filename'] . '.omdoc';
        } elseif ('omdoc' != $PathInfo['extension']) {
            return $Error;
        }

        $Data =
                'declare default element namespace "http://omdoc.org/ns";'
                . 'declare namespace dc = "http://purl.org/dc/elements/1.1/";'
                . '(tnt:doc("' . $FilePath . '")'
                . '//dc:title)[1]'
        ;

        $Response = WebRequest::cURL_POST($Data, C('TNTBase.XQueryURL'));
        $Title = TNTBaseComm::_StripTNTBaseResults($Response, true);
        if (empty($Title)) {
            return $Error;
        }

        return $Title[0];
    }

    /**
     * Method to be used for committing specific articles into TNTBase
     * May be used to either add new files or update existing ones
     * <i>Note: Only support sending valid sTeX files and will fail if sTeX is not proper</i>
     * @param array $Files an array of file structs with <b>Content</b> and <b>Path</b> fields
     * @return the head revision after the commit or <b>false</b> if the commit failed 
     */
    static public function CommitFiles($Files) {
        $Request = array();

        if (false == C('TNTBase.sTeXTransform')) {
            $host = C('Plugins.LaTeXEditor.LaTeXEditor');
        } else {
            $host = C('Plugins.LaTeXEditor.sTeXEditor');
        }
        foreach ($Files as $File) {
            $File['Content-Type'] = 'text/plain';
            $PathInfo = pathinfo($File['Path']);
            if ($PathInfo['extension'] != 'tex') {
                //TODO: return something more meaningful
                return false;
            }
            $Request[] = $File;

            $NewFile = array();
            $NewFile['Path'] = $PathInfo['dirname'] . '/' . $PathInfo['filename'] . '.omdoc';
            $NewFile['Content-Type'] = 'text/xml';
            // Getting OMDoc
            //TODO: get this from Deyan's daemon
            $data = 'formula=' . urlencode($File['Content']);
            $content = WebRequest::cURL_POST($data, $host);
            $res = json_decode($content);

            $NewFile['Content'] = trim($res->{'result'});
            if (false == $NewFile['Content']) {
                //TODO: return something more meaningful
                return false;
            }
            $Request[] = $NewFile;
        }
        if (empty($Request)) {
            //TODO: return something more meaningful
            return false;
        }

        $Response = WebRequest::cURL_PUT_MultipartFiles($Request, C('TNTBase.CommitFilesURL'));

        $Document = new DOMDocument();
        $Document->loadXML($Response);

        $Xpath = new DOMXPath($Document);
        $Xpath->registerNamespace('tnt', "http://tntbase.mathweb.org/ns");
        $Query = "//tnt:revision";
        $Nodelist = $Xpath->query($Query);
        $Response = $Nodelist->item(0)->nodeValue;

        return $Response;
    }

    /**
     * Method to be used for committing a specific article into TNTBase
     * May be used to either add a new file or update an existing one
     * @param string $Content the content to try to commit
     * @param string $FilePath the FilePath into TNTBase under which to save the content
     * @return the revision number of the file just commited or <b>false</b> if the commit failed 
     */
    static public function CommitXML($Content, $FilePath) {
        $Response = WebRequest::cURL_PUT($Content, C('TNTBase.CommitURL') . $FilePath);
        $Message = TNTBaseComm::_StripTNTBaseResults($Response, false);

        // check message
        if (!$Message) {
            return false;
        }

        $Revision = TNTBaseComm::_GetResultRevision($Message);

        // It is either false or the number
        return $Revision;
    }

    /**
     * Method to be used for deleting a specific article from TNTBase
     * @param string $FilePath the path into TNTBase of the file in question
     */
    static public function DeleteFile($FilePath) {
        // Checking for FilePath to be .omdoc else if .tex, querying for the .omdoc as needed
        $PathInfo = pathinfo($FilePath);
        if (!('tex' == $PathInfo['extension'] || 'omdoc' == $PathInfo['extension'])) {
            return false;
        }

        $Response = WebRequest::cURL_DELETE(C('TNTBase.CommitURL') . $PathInfo['dirname'] . '/' . $PathInfo['filename'] . '.tex');
        $Message = TNTBaseComm::_StripTNTBaseResults($Response, false);
        /*
          // check message
          if(! $Message) {
          return false;
          }
         */

        $Response = WebRequest::cURL_DELETE(C('TNTBase.CommitURL') . $PathInfo['dirname'] . '/' . $PathInfo['filename'] . '.omdoc');
        $Message = TNTBaseComm::_StripTNTBaseResults($Response, false);
        /*
          // check message
          if(! $Message) {
          return false;
          }
         */

        //TODO: you can extract a revision count from this!!!
        //$Revision = TNTBaseComm::_GetResultRevision($Message);
        // It is either false or the number
        return $Revision;
    }

    /**
     * Method for executing any query to TNTBase
     * @param string $Query the query to execute
     * @return the result 
     */
    static public function Query($Query) {
        $Response = WebRequest::cURL_POST($Query, C('TNTBase.XQueryURL'));
        return TNTBaseComm::_StripTNTBaseResults($Response);
    }

    /**
     * This method should be used to split responses wrapped into a <tnt:results> tag and strip the inner <tnt:result> tag as well.
     * 
     * @param string $Response the response to be stripped
     */
    static private function _StripTNTBaseResults($Response, $StripEach = true) {
        $Results = array();
        $Document = new DOMDocument();
        $Document->loadXML($Response);

        $Xpath = new DOMXPath($Document);
        $Xpath->registerNamespace('tnt', "http://tntbase.mathweb.org/ns");

        $Query = "//tnt:error";
        $Nodelist = $Xpath->query($Query);
        if (0 < $Nodelist->length) {
            return $Results;
        }

        $Query = "//tnt:results";
        $Nodelist = $Xpath->query($Query);
        $Nodelist = $Nodelist->item(0)->childNodes;

        for ($i = 0; $i < $Nodelist->length; $i++) {
            if ($StripEach == true) {
                $Results[] = substr($Document->saveXML($Nodelist->item($i)), strlen("<tnt:result>"), (-1) * strlen("</tnt:result>"));
            } else {
                $Results[] = $Document->saveXML($Nodelist->item($i));
            }
        }
        return $Results;
    }

    /**
     * Internal method used to interpret the return message and retrieve the revision of the last change
     * @param string $Message the message returned by the last commit
     * @return the last revision number change or <b>false</b> if the message does not containt one
     */
    static private function _GetResultRevision($Message) {
        $Pattern = "/Commit info: r([0-9]*) /";
        $Matches = array();
        preg_match($Pattern, $Message, $Matches);

        if (empty($Matches[1])) {
            return false;
        }

        return $Matches[1];
    }

    /**
     * Method for getting all the necessary pieces of a document bundled up together in key => value array form
     * @param string $FilePath the path to the OMDOC file in question
     * @return an associative array or <b>false</b> if the path is not proper
     */
    static private function _GetDocument($FilePath) {
        $Source = TNTBaseComm::GetSource($FilePath);
        $Presentation = TNTBaseComm::GetPresentation($FilePath);
        $Title = TNTBaseComm::GetTitle($FilePath);
        $Revision = TNTBaseComm::GetRevisions($FilePath, true);
        $Document = array(
            'Body' => $Source,
            'BodyXHTML' => $Presentation,
            'TitleXHTML' => $Title,
            'Revision' => $Revision,
            'Path' => $FilePath
        );

        if (false == $Source ||
                false == $Presentation ||
                false == $Title ||
                false == $Revision ||
                false == $FilePath) {
            //TODO: MAKE THIS RETURN PROPER MEANINGFUL ERROR
//				return false;
        }

        return $Document;
    }

    /**
     * Method used to get all the names of all the omdoc files in TNTBase under a certain folder structure.
     * <i>Note: This method recurses into all subfolders!</i>
     * @param string $RootPath the path to the root of the folder structure
     * @return an array of all the paths starting from the repository root of all the files under the given folder, else <b>false</b> otherwise
     */
    static private function _GetDocumentNames($RootPath) {
        $Response = WebRequest::cURL_GET(C('TNTBase.DocumentNamesURL') . $RootPath . '?recursive=true');

        if (empty($Response)) {
            return false;
        }

        $Document = new DOMDocument();
        $Document->loadXML($Response);

        $Xpath = new DOMXPath($Document);
        $Xpath->registerNamespace('tnt', "http://tntbase.mathweb.org/ns");
        $Query = "//tnt:docname";
        $Nodelist = $Xpath->query($Query);

        $Result = array();
        for ($i = 0; $i < $Nodelist->length; $i++) {
            $Result[] = $Nodelist->item($i)->nodeValue;
        }

        if (empty($Result)) {
            return false;
        }

        return $Result;
    }

    /**
     * Method for getting the actual SVN log from TNTBase
     * @param int $StartRev
     * @param int $EndRev
     * @return an array of A and D corresponding to the resolved added and deleted files
     */
    static private function _GetLog($StartRev, $EndRev) {
        $Log = WebRequest::cURL_GET(C('TNTBase.LogURL') . "?startrev=$StartRev&endrev=$EndRev");
        $Revisions = explode(",", $Log);

        $D = array();
        $A = array();

        foreach ($Revisions as $Rev) {
            $Lines = explode("\n", $Rev);
            $Dump = false;
            foreach ($Lines as $Line) {
                if (false == $Dump) {
                    if (0 == strpos($Line, "svn:date")) {
                        $Dump = true;
                    }
                } else {
                    if ("A" == $Line[0]) {
                        $File = substr($Line, 2);
                        $Ret = array_search($File, $D);
                        $A[] = $File;
                        if (false == $Ret) {
                            //
                        } else {
                            unset($D[$Ret]);
                        }
                    } elseif ("D" == $Line[0]) {
                        $File = substr($Line, 2);
                        $Ret = array_search($File, $A);
                        $D[] = $File;
                        if (false == $Ret) {
                            //
                        } else {
                            unset($A[$Ret]);
                        }
                    }
                }
            }
        }

        $Modifications = array("A" => $A, "D" => $D);
        return $Modifications;
    }

    public function Setup() {
        
    }

}