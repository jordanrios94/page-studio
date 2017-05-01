<nav class="navbar navbar-default navbar-fixed-top am-top-header">
	<div class="container-fluid">
		<div class="navbar-header">
			<div class="page-title"><span>@{{ title }}</span></div>
			<a href="#" class="am-toggle-left-sidebar navbar-toggle collapsed"><span class="icon-bar"><span></span><span></span><span></span></span></a><a href="/" class="navbar-brand"></a>
		</div>

        @if ($page === 'editor')
		<a href="#" class="am-toggle-right-sidebar"><span class="icon s7-menu2"></span></a><a href="#" data-toggle="collapse" data-target="#am-navbar-collapse" class="am-toggle-top-header-menu collapsed"><span class="icon s7-angle-down"></span></a>
        @endif

		<div id="am-navbar-collapse" class="collapse navbar-collapse">
			<ul class="nav navbar-nav navbar-right am-user-nav">

                @if (Auth::check())
				<li class="dropdown">
					<a href="#" data-toggle="dropdown" role="button" aria-expanded="false" class="dropdown-toggle"><img src="/assets/img/avatar9.jpg"><span class="user-name">Jordan Rios</span><span class="angle-down s7-angle-down"></span></a>
					<ul role="menu" class="dropdown-menu">
						<li><a href="#"> <span class="icon s7-user"></span>My profile</a></li>
						<li><a href="#"> <span class="icon s7-config"></span>Settings</a></li>
						<li><a href="#"> <span class="icon s7-help1"></span>Help</a></li>
						<li><a href="#"> <span class="icon s7-power"></span>Sign Out</a></li>
					</ul>
				</li>
                @else
                <li><a href="/login">Login</a></li>
                <li><a href="/register">Sign up</a></li>
                @endif
			</ul>

            <ul class="nav navbar-nav am-nav-right">
                @if ($page === 'editor')
                    <li><a href="/editor/create">New Page</a></li>
                    <li><a href="#" class="collaborate-btn" @click="startCallaborate($event)" data-end-togetherjs-html="End Calloboration">Collaborate</a></li>

                    @if ($state === 'create')
                    <li><a href="#" @click="save($event)">Save</a></li>
                    @elseif ($state === 'update')
                    <li><a href="#" @click="update($event)">Update</a></li>
                    @endif

                    <!--<li class="dropdown">
                        <a href="#" data-toggle="dropdown" role="button" aria-expanded="false" class="dropdown-toggle">File <span class="angle-down s7-angle-down"></span></a>
                        <ul role="menu" class="dropdown-menu">
                            <li><a href="#">Export</a></li>
                            <li><a href="#">Import</a></li>
                            <li><a href="#">Print</a></li>
                        </ul>
                    </li>-->
                @else
                    <li><a href="#">New Page</a></li>
                @endif
            </ul>

            <!--
			<ul class="nav navbar-nav navbar-right am-icons-nav">
				<li class="dropdown">
					<a href="#" data-toggle="dropdown" role="button" aria-expanded="false" class="dropdown-toggle"><span class="icon s7-comment"></span></a>
					<ul class="dropdown-menu am-messages">
						<li>
							<div class="title">Messages<span class="badge">3</span></div>
							<div class="list">
								<div class="am-scroller nano">
									<div class="content nano-content">
										<ul>
											<li class="active">
												<a href="#">
													<div class="logo"><img src="/assets/img/avatar2.jpg"></div>
													<div class="user-content"><span class="date">April 25</span><span class="name">Jessica Caruso</span><span class="text-content">Request you to be a part of the same so that we can work...</span></div>
												</a>
											</li>
											<li>
												<a href="#">
													<div class="logo"><img src="/assets/img/avatar3.jpg"></div>
													<div class="user-content"><span class="date">March 18</span><span class="name">Joel King</span><span class="text-content"> We wish to extend the building.</span></div>
												</a>
											</li>
											<li>
												<a href="#">
													<div class="logo"><img src="/assets/img/avatar4.jpg"></div>
													<div class="user-content"><span class="date">January 3</span><span class="name">Claire Sassu</span><span class="text-content"> We the ladies of a block are wiling to join together to set up a catering...</span></div>
												</a>
											</li>
											<li>
												<a href="#">
													<div class="logo"><img src="/assets/img/avatar5.jpg"></div>
													<div class="user-content"><span class="date">January 2</span><span class="name">Emily Carter</span><span class="text-content"> Request you to be a part of the same so that we can work...</span></div>
												</a>
											</li>
										</ul>
									</div>
								</div>
							</div>
							<div class="footer"> <a href="#">View all messages</a></div>
						</li>
					</ul>
				</li>
				<li class="dropdown">
					<a href="#" data-toggle="dropdown" role="button" aria-expanded="false" class="dropdown-toggle"><span class="icon s7-bell"></span><span class="indicator"></span></a>
					<ul class="dropdown-menu am-notifications">
						<li>
							<div class="title">Notifications<span class="badge">3</span></div>
							<div class="list">
								<div class="am-scroller nano">
									<div class="content nano-content">
										<ul>
											<li class="active">
												<a href="#">
													<div class="logo"><span class="icon s7-pin"></span></div>
													<div class="user-content"><span class="circle"></span><span class="name">Jessica Caruso</span><span class="text-content"> accepted your invitation to join the team.</span><span class="date">2 min ago</span></div>
												</a>
											</li>
											<li>
												<a href="#">
													<div class="logo"><span class="icon s7-add-user"></span></div>
													<div class="user-content"><span class="name">Joel King</span><span class="text-content"> is now following you</span><span class="date">2 days ago</span></div>
												</a>
											</li>
											<li>
												<a href="#">
													<div class="logo"><span class="icon s7-gleam"></span></div>
													<div class="user-content"><span class="name">Claire Sassu</span><span class="text-content"> is watching your main repository</span><span class="date">2 days ago</span></div>
												</a>
											</li>
											<li>
												<a href="#">
													<div class="logo"><span class="icon s7-add-user"></span></div>
													<div class="user-content"><span class="name">Emily Carter</span><span class="text-content"> is now following you</span><span class="date">5 days ago</span></div>
												</a>
											</li>
										</ul>
									</div>
								</div>
							</div>
							<div class="footer"> <a href="#">View all notifications</a></div>
						</li>
					</ul>
				</li>
				<li class="dropdown">
					<a href="#" data-toggle="dropdown" role="button" aria-expanded="false" class="dropdown-toggle"><span class="icon s7-share"></span></a>
					<ul class="dropdown-menu am-connections">
						<li>
							<div class="title">Connections</div>
							<div class="list">
								<div class="content">
									<ul>
										<li>
											<div class="logo"><img src="/assets/img/github.png"></div>
											<div class="field">
												<span>GitHub</span>
												<div class="pull-right">
													<div class="switch-button switch-button-sm">
														<input type="checkbox" checked="" name="check1" id="switch1"><span>
														<label for="switch1"></label></span>
													</div>
												</div>
											</div>
										</li>
										<li>
											<div class="logo"><img src="/assets/img/bitbucket.png"></div>
											<div class="field">
												<span>Bitbucket</span>
												<div class="pull-right">
													<div class="switch-button switch-button-sm">
														<input type="checkbox" name="check2" id="switch2"><span>
														<label for="switch2"></label></span>
													</div>
												</div>
											</div>
										</li>
										<li>
											<div class="logo"><img src="/assets/img/slack.png"></div>
											<div class="field">
												<span>Slack</span>
												<div class="pull-right">
													<div class="switch-button switch-button-sm">
														<input type="checkbox" checked="" name="check3" id="switch3"><span>
														<label for="switch3"></label></span>
													</div>
												</div>
											</div>
										</li>
										<li>
											<div class="logo"><img src="/assets/img/dribbble.png"></div>
											<div class="field">
												<span>Dribbble</span>
												<div class="pull-right">
													<div class="switch-button switch-button-sm">
														<input type="checkbox" name="check4" id="switch4"><span>
														<label for="switch4"> </label></span>
													</div>
												</div>
											</div>
										</li>
									</ul>
								</div>
							</div>
							<div class="footer"> <a href="#">View all connections</a></div>
						</li>
					</ul>
				</li>
			</ul>
            -->
		</div>
	</div>
</nav>