<?php
      function getInt($str)
      {
            preg_match("/([0-9]+[\.,]?)+/",$str,$matches);
            return $matches[0];
      }
?>