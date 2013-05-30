\begin{module}[id=<?php echo $vars["moduleid"] ?>]
<?php
	foreach ($vars["imports"] as $import) {
		echo "\\gimport{".$import."}\n";
	}

	foreach ($vars["symbols"] as $symbol) {
		echo "\\symbol{".$symbol."}\n";
	}
?>

\end{module}
