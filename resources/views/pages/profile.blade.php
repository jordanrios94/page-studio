@extends('layouts.base')

@section('page')
<div id="app" class="am-wrapper am-nosidebar-left">

    @include('partials.editor-navbar', $context)

    <div class="am-content">
        <div class="main-content">
            <div class="user-profile">
                <div class="user-display">
              <div class="photo"><img src="{{ $profile->cover_url }}"></div>
              <div class="bottom">
                <div class="user-avatar"><img src="{{ $profile->profile_url }}"></div>
                <div class="user-info">
                  <h4>{{ $profile->name or $profile->username }} <small>{{ '@' . $profile->username }}</small></h4>
                  <span>{{ $profile->bio }}</span>
                </div>
              </div>
            </div>
            </div>
          <div class="gallery-container">

            @foreach ($pages as $page)
            <div class="item">
              <div class="photo">
                <div class="img"><iframe name="preview" src="/page/preview/{{ $page->id }}" height="100%" style="position: absolute;" frameborder="0"></iframe>
                  <div class="over">
                    <div class="func">
                      <a href="#"><i class="icon s7-link"></i></a>
                      <a href="/page/{{ $page->id }}" class="image-zoom"><i class="icon s7-monitor"></i></a></div>
                  </div>
                </div>
                <div class="description">
                  <div class="icon"><a href="#"><i class="s7-like"></i></a></div>
                  <div class="desc">
                    <h4>{{ $page->title }}</h4><span>{{ $page->created_at->diffForHumans() }}</span>
                  </div>
                </div>
              </div>
            </div>
            @endforeach

          </div>
          
          @if ($pages->lastPage() > 1)
          <div class="text-center">
            <button class="btn btn-primary">Load more</button>
          </div>
          @endif
        </div>
    </div>
</div>
@endsection


@push('script-body')
<script>
    @if (Auth::check())
    window.User = <?php echo json_encode([
        'data' => Auth::user(),
    ]); ?>;
    @endif

     
    window.Profile = <?php echo json_encode([
        'data' => $profile
    ]); ?>;

    window.Laravel = <?php echo json_encode([
        'csrfToken' => csrf_token(),
        'apiToken' => md5(Session::getId())
    ]); ?>;
</script>
<script src="/js/profile.js" type="text/javascript"></script>
@endpush