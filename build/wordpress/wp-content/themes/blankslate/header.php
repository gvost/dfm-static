<!DOCTYPE html>
<html <?php language_attributes(); ?>>
	<head>
		<meta charset="<?php bloginfo( 'charset' ); ?>" />
		<meta name="viewport" content="width=device-width" />
		<title>DFM | <?php wp_title( ' | ', true, 'right' ); ?></title>
		<link rel="icon" href="/images/favicon.png" type="image/x-icon" />
		<link rel="shortcut icon" href="/images/favicon.png" type="image/x-icon" />
		<link rel="stylesheet" type="text/css" href="/stylesheets/application.css">
		<link rel="stylesheet" type="text/css" href="<?php echo get_stylesheet_uri(); ?>" />
		<?php wp_head(); ?>
	</head>
	<body <?php body_class(); ?>>
		<div id="loading-page"></div>
		<div id="header">
		    <a href="/" class="to-home"><img src="/images/logo.png" id="logo" alt=""></a>
		  <div id="nav-toggle">Explore</div>
		</div>
		<div id="nav-page">
		  <ul>
		    <li class="nav-heading">Case Studies</li>
		    <li><a class="page-links" href="/kavaldon">Kavaldon</a></li>
		    <li><a class="page-links" href="/selvarey">Selvarey</a></li>
		    <li><a class="page-links" href="/AVF">Alexandra Von Furstenburg</a></li>
		    <li><a class="page-links" href="/velvet">Velvet by Graham and Spencer</a></li>
		  </ul>
		  <ul>
		    <li class="nav-heading">Our Work</li>
		    <li><a class="page-links" href="/strategy">Brand Strategy</a></li>
		    <li><a class="page-links" href="/identity">Identity Design</a></li>
		    <li><a class="page-links" href="/packaging">Packaging and Collateral</a></li>
		    <li><a class="page-links" href="/imagery">Imagery</a></li>
		    <li><a class="page-links" href="/interactive">Interactive</a></li>
		    <li><a class="page-links" href="/environment">Environment</a></li>
		  </ul>
		  <ul>
		    <li class="nav-heading">
		      <a class="page-links" href="/about">About</a>
		    </li>
		  </ul>
		  <ul>
		    <li class="nav-heading">
		      <a class="page-links no-prevent" href="http://104.236.5.92:3001/" target="_blank">Blog</a>
		    </li>
		  </ul>
		  <ul>
		    <li class="nav-heading">
		      <a class="page-links" href="/contact">Contact</a>
		    </li>
		  </ul>
		  <div class="social-links">
		    <a class="page-links no-prevent" href="https://www.pinterest.com/dfmla/" target="_blank">Pinterest</a>
		    <a class="page-links no-prevent" href="http://drawingfrommemory.com/we-made-this-instagram" target="_blank">Instagram</a>
		  </div>
		</div>


	