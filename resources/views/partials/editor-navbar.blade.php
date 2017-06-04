<nav class="navbar navbar-default navbar-fixed-top am-top-header">
	<div class="container-fluid">
		<div class="navbar-header">
			<div class="page-title">
				<span>
					@if ($page === 'editor')
						@{{ pageName }}
					@else
						{{ $title }}
					@endif
				</span>
			</div>
			@if ($page === 'editor')
			<a href="#" class="am-toggle-left-sidebar navbar-toggle collapsed">
				<span class="icon-bar"><span></span><span></span><span></span></span>
			</a>
			@endif
			<a href="/" class="navbar-brand"></a>
		</div>
    	@if ($page === 'editor')
		<a href="#" class="am-toggle-right-sidebar">
			<span class="icon s7-menu2"></span>
		</a>
		@endif
		<a href="#" data-toggle="collapse" data-target="#am-navbar-collapse" class="am-toggle-top-header-menu collapsed">
			<span class="icon s7-angle-down"></span>
		</a>
		<div id="am-navbar-collapse" class="collapse navbar-collapse">
			<ul class="nav navbar-nav navbar-right am-user-nav">
                @if (Auth::check())
				<li class="dropdown">
					<a href="#" data-toggle="dropdown" role="button" aria-expanded="false" class="dropdown-toggle">
						<img src="{{ $user->profile_url }}">
						<span class="user-name">{{ $user->name }}</span>
						<span class="angle-down s7-angle-down"></span>
					</a>
					<ul role="menu" class="dropdown-menu">
						<li><a href="/profile/{{ $user->username }}"> <span class="icon s7-user"></span>My profile</a></li>
						<li><a href="/profile/settings"> <span class="icon s7-config"></span>Settings</a></li>
						<li>
							<a href="{{ route('logout') }}" onclick="event.preventDefault();document.getElementById('logout-form').submit();">
								<span class="icon s7-power"></span>Sign Out
							</a>
							<form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
								{{ csrf_field() }}
							</form>
						</li>
					</ul>
				</li>
                @else
                <li><a href="/login">Login</a></li>
                <li><a href="/register">Sign up</a></li>
                @endif
			</ul>
            <ul class="nav navbar-nav am-nav-right">
				<li class="dropdown">
					<a href="#" data-toggle="dropdown" role="button" aria-expanded="false" class="dropdown-toggle">New <span class="angle-down s7-angle-down"></span></a>
					<ul role="menu" class="dropdown-menu">
						<li><a href="/page/create/basic">Basic Page</a></li>
						<li><a href="/page/create/bootstrap">Bootstrap Page</a></li>
					</ul>
				</li>
                @if ($page === 'editor')
                    <li><a href="#" class="collaborate-btn" @click="startCallaborate($event)" data-end-togetherjs-html="End Calloboration">Collaborate</a></li>

                    @if ($state === 'create')
                    <li><a href="#" @click="save($event)">Save</a></li>
                    @elseif ($state === 'update')
						@if (Auth::check() && $user->id == $data['page']->creator_user_id)
                    	<li><a href="#" @click="update($event)">Update</a></li>	
						@elseif (!Auth::check() && $data['page']->creator_user_id == 0 && $data['page']->sid == $session_id)
						<li><a href="#" @click="update($event)">Update</a></li>
						@endif
                    @endif
                @endif
            </ul>
		</div>
	</div>
</nav>